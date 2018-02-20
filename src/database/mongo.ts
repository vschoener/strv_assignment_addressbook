import * as mongoose from "mongoose";
/// <reference path="promise-bluebird.d.ts" />

export default class Mongo {
    connection: mongoose.Connection;

    constructor(private uri: string) {
        this.connection = mongoose.connection;
    }

    /**
     * Connect to database
     */
    async connect() {
        return mongoose.connect(this.uri).then(() => {
            this.connection = mongoose.connection;
            console.log("Connected to MongoDB server");
        }).catch(err => {
            console.error("MongoDB error:", err);
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
