import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as errorhandler from 'errorhandler';
import { Context } from './context';
import { IRequest } from './http/request';
import routes from './api';
import { Mongo } from './database/mongo';
import { Logger } from './logger/logger';

export class App {
    constructor(
        private app: express.Application,
        private port: string,
        private context: Context,
        private database: Mongo,
        private logger: Logger,
    ) {}

    private checkRequirements() {
        if (this.context.getEnv() == undefined) {
            throw new Error('env type is not set');
        }
    }

    /**
     * Attach core basics middleware
     * @returns {App}
     */
    private attachCoreMiddleware(): App {
        if (this.context.getEnv() === 'dev') {
            this.app.use(errorhandler());
        }
        this.app.use(morgan(this.context.getEnv()));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors());

        return this;
    }

    /**
     * Attach app middleware logic
     * @returns {App}
     */
    private attachAppMiddleware(): App {
        // Use our new Request interface with new data
        this.app.use((req: IRequest, res: express.Response, next: any) => {
            req.context = this.context;
            next();
        });

        this.app.use(routes);
        this.app.use(morgan('combined'));

        return this;
    }

    /**
     * Handle any problem with routes
     * @returns {App}
     */
    attachRoutingIssueMiddleware(): App {
        this.app.use((req: express.Request, res: express.Response, next: any) => {
            const error = new Error('Resource not found');
            res.status(404);
            return this.responseError(res, error);
        });

        this.app.use((error: Error, req: express.Request, res: express.Response, next: any) => {
            res.status(500);
            return this.responseError(res, error);
        });

        return this;
    }

    /**
     * @param {e.Response} res
     * @param {Error} error
     * @returns {e.Response}
     */
    private responseError(res: express.Response, error: Error): express.Response {
        const result: any = {
            message: error.message
        };

        if (['dev', 'test'].indexOf(this.context.getEnv()) >= 0) {
            this.logger.error(error.message);
            this.logger.error(error.stack);
            result.stack = error.stack;
        }

        return res.json(result);
    }

    /**
     * Initialize our app
     * @returns {App}
     */
    initialize(): App {
        this.checkRequirements();
        this.attachCoreMiddleware();
        this.attachAppMiddleware();
        this.attachRoutingIssueMiddleware();

        return this;
    }

    // Run the app
    async run(): Promise<App> {
        this.initialize();
        await this.database.connect();
        this.context.firebase.initialize();

        return new Promise<App>((resolve) => {
            this.app.listen(this.port, () => {
                const message = `Server running on port ${this.port}`;
                this.logger.info(message);
                resolve(this);
            });
        });
    }
}
