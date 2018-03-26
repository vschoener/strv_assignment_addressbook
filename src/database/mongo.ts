import * as mongoose from 'mongoose';
import { Logger } from '../logger/logger';
/// <reference path="promise-bluebird.d.ts" />

export class Mongo {
    connection: mongoose.Connection;
    logger: Logger;

    constructor(private uri: string) {
        this.connection = mongoose.connection;
    }

    /**
     * Connect to database
     */
    connect() {
        return mongoose.connect(this.uri).then(() => {
            this.connection = mongoose.connection;
            this.logger.debug('Connected to MongoDB server');
        }).catch(err => {
            this.logger.error(`MongoDB error: ${err}`);
            process.exit(1);
        });
    }

    disconnect() {
        this.connection.close();
    }

    /**
     * Return the connection state of Mongo connection
     */
    getMongoConnectionState(): number {
        return this.connection.readyState;
    }
}
