import * as dotenv from 'dotenv';
import * as bluebird from 'bluebird';
import * as express from 'express';

import { App } from './app';
import { Server } from './server';
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

// @TODO: Log to a file that rotates daily if we don't use an external logger service (we should)
const logger = new Logger(__dirname + '/../logs', `app_${context.getEnv()}.log`, context);
logger.initialize();

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

const server: Server = new Server(
    expressApp,
    process.env.PORT || '80',
    context
);
server.logger = logger;

const app = new App(
    context,
    server,
    mongo
);
app.logger = logger;
app.initialize();

export { app, expressApp, mongo, logger };
