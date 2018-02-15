import * as express from "express";
import * as errorhandler from "errorhandler";
import * as logger from "morgan";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { Server as HttpServer } from "http";

export default class Server {
    private httpServer: HttpServer;
    private expressApp: express.Application;
    private port: string;
    private env: string;

    constructor() {}

    // Set current working express application
    useExpressApp(expressApp: express.Application): Server {
        this.expressApp = expressApp;
        this.port = this.expressApp.get("port");
        this.env = this.expressApp.get("env");

        return this;
    }

    /**
     * Set up the basics / core needs of our server
     */
    attachMiddleWares(): Server {
        // Only use in development
        if (this.env === "dev") {
            this.expressApp.use(errorhandler());
        }
        this.expressApp.use(logger(this.env));
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        this.expressApp.use(cors());

        return this;
    }

    attachRouter(router: express.Router): Server {
        this.expressApp.use(router);

        return this;
    }

    /**
     * Set error handler on the current express application
     */
    attachErrorHandler(): Server {
        this.expressApp.use((req: express.Request, res: express.Response, next: any) => {
            const error = new Error("Resource not found");
            res.status(404);
            return this.responseError(res, error);
        });

        this.expressApp.use((error: Error, req: express.Request, res: express.Response, next: any) => {
            res.status(500);
            return this.responseError(res, error);
        });

        return this;
    }

    private responseError(res: express.Response, error: Error): express.Response {
        const result: any = {
            error: {
                message: error.message
            }
        };

       if (this.env === "dev") {
            result.error.stack = error.stack;
       }

       return res.json(result);
    }

    runServer(succeed: (port: string, env: string) => void): void {
        this.httpServer = this.expressApp.listen(this.port, () => {
            succeed(this.port, this.env);
        });
    }

    close(): void {
        this.httpServer.close();
    }

    getHttpServer(): HttpServer {
        return this.httpServer;
    }
}
