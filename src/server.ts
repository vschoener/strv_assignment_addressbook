import * as express from 'express';
import * as errorhandler from 'errorhandler';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { Context } from './context';
import { Logger } from './logger/logger';

export interface IServer {
    initialize(): IServer;
    start(): void;
    getApp(): express.Application;
    useErrorsHandler(): void;
}

export class Server implements IServer {
    isInitialized: boolean = false;
    logger: Logger;

    constructor(
        private app: express.Application,
        private port: string,
        private context: Context) {}

    getApp(): express.Application {
        return this.app;
    }

    // This method needs to be call, it load the basics needs and let the
    // App behind adding more middleware if it needs
    initialize(): IServer {
        if (this.context.getEnv() == undefined) {
            throw new Error('ENV environment is not set');
        } else if (this.port == undefined) {
            throw new Error('PORT environment is not set');
        }

        this.app.set('env', this.context.getEnv());

        this.attachCoreMiddleware();
        this.isInitialized = true;

        return this;
    }

    private attachCoreMiddleware(): Server {
        if (this.context.getEnv() === 'dev') {
            this.app.use(errorhandler());
        }
        this.app.use(logger(this.context.getEnv()));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors());

        return this;
    }

    useErrorsHandler(): IServer {
        this.app.use((req: express.Request, res: express.Response, next: any) => {
            const error = new Error('Resource not found');
            res.status(404);
            return this.responseError(res, error);
        });

        this.app.use((error: Error, req: express.Request, res: express.Response, next: any) => {
            res.status(500);
            if (this.logger) {
                this.logger.error(error.message);
                this.logger.error(error.stack);
            }
            return this.responseError(res, error);
        });

        return this;
    }

    private responseError(res: express.Response, error: Error): express.Response {
        const result: any = {
            message: error.message
        };

        if (this.context.getEnv() === 'dev') {
            result.stack = error.stack;
        }

        return res.json(result);
    }

    start() {
        if (!this.isInitialized) {
            const error = new Error('Server needs to be initialized before running the server');
            if (this.logger) {
                this.logger.error(error.message);
                this.logger.error(error.stack);
            }
            throw error;
        }

        this.app.listen(this.port, () => {
            const message = `Server running on port ${this.port}`;
            if (this.logger) {
                this.logger.info(message);
            }
        });
    }
}
