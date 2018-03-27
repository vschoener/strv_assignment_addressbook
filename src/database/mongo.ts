import * as mongoose from 'mongoose';
import { Logger } from '../logger/logger';
/// <reference path="promise-bluebird.d.ts" />

export interface MongoCredential {
    user: string;
    pass: string;
    host: string;
    port: string;
    database: string;
}

export class Mongo {
    connection: mongoose.Connection;
    logger: Logger;

    constructor(private credential: MongoCredential) {
        this.connection = mongoose.connection;
    }

    /**
     * Connect to database
     */
    connect() {
        return mongoose.connect(this.buildURI()).then(() => {
            this.connection = mongoose.connection;
            this.logger.info('Connected to MongoDB server');
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

    private buildURI(): string {
        let uri = 'mongodb://';

        if (this.credential.user) {
            uri += `${this.credential.user}:${this.credential.pass}@`;
        }

        uri += `${this.credential.host}:${this.credential.port}/${this.credential.database}`;

        return uri;
    }
}
