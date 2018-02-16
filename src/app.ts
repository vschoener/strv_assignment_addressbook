import * as express from "express";
import { Server as httpServer } from "http";

import Server from "./server";
import appRouter from "./api";
import Mongo from "./database/mongo";

export class App {
    private appExpress: express.Application;

    constructor(
        private env: string,
        private port: string,
        private server: Server,
        private mongo: Mongo) {}

    /**
     * This method builds our logic application server
     */
    async initialize(): Promise<any> {
        this.appExpress = express();
        this.appExpress.set("env", this.env);
        this.appExpress.set("port", this.port);
        this.server
            .useExpressApp(this.appExpress)
            .attachMiddleWares()
            .attachRouter(appRouter)
            .attachErrorHandler()
        ;
    }

    /**
     * This method runs our server
     */
    async run(): Promise<any> {
        this.server.runServer((port: string, env: string) => {
            console.log(`API server running on port ${port} in the "${env}" environment`);
        });

        const mongo = await this.mongo.connect();

        return mongo;
    }

    getAppExpress(): express.Application {
        return this.appExpress;
    }

    getHttpServer(): httpServer {
        return this.server.getHttpServer();
    }

    getMongo(): Mongo {
        return this.mongo;
    }
}
