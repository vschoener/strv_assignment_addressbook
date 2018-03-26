import * as express from 'express';
import * as morgan from 'morgan';

import { Context } from './context';
import { IServer } from './server';
import { IRequest } from './http/request';
import routes from './api';
import { Mongo } from './database/mongo';
import { Logger } from './logger/logger';

// Export an App Interface
export interface IApp {
    initialize(): IApp;
    run(): void;
}

export class App implements IApp {
    logger: Logger;

    constructor(
        private context: Context,
        private server: IServer,
        private database: Mongo
    ) {}

    initialize(): IApp {
        this.server.initialize();

        this.server.getApp().use((req: IRequest, res: express.Response, next: any) => {
            req.context = this.context;
            next();
        });

        this.server.getApp().use(routes);
        this.server.getApp().use(morgan('combined'));
        this.server.useErrorsHandler();

        return this;
    }

    // Run the app
    async run() {
        await this.database.connect();
        this.context.firebase.initialize();
        this.server.start();
    }
}
