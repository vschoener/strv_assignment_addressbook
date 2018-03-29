import * as dotenv from 'dotenv';
import * as bluebird from 'bluebird';
import * as express from 'express';

import { App } from './app';
import { Mongo } from './database/mongo';
import { Context } from './context';
import { Firebase } from './firebase/firebase';
import { Logger } from './logger/logger';

global.Promise = bluebird;

// Load the env file in overload settings exist
dotenv.config({path: __dirname + '/../.env'});
if (process.env.JWT_SECRET === undefined) {
    console.error('JWT_SECRET env is missing, please set it');
    process.exit(1);
}

const context = new Context(process.env.NODE_ENV || 'dev', process.env.JWT_SECRET);
context.jwtExpire = parseInt(process.env.JWT_EXPIRE) || 3600;

// @TODO: Log to a file that rotates daily if we don't use an external logger service
const logger = new Logger();
logger.initialize({
    fileDirectory: __dirname + '/../logs',
    fileName: `app_${context.getEnv()}.log`,
    logLevel: process.env.LOG_LEVEL,
    colorize: Boolean(process.env.LOG_COLORIZE),
    jsonFormat: Boolean(process.env.LOG_JSON_FORMAT),
    handleException: Boolean(process.env.LOG_EXCEPTION)
});

const expressApp: express.Application = express();
const firebase = new Firebase(
    process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT_FILE,
    process.env.FIREBASE_URL
);
context.firebase = firebase;

const mongo = new Mongo({
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DATABASE,
});
mongo.logger = logger;

const app = new App(
    expressApp,
    process.env.PORT || '80',
    context,
    mongo,
    logger
);
app.initialize();

// Mongo, will start only during the app:run
export { app, expressApp, mongo, logger, firebase };
