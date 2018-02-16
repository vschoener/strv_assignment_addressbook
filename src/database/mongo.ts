import * as mongoose from "mongoose";
import * as bluebird from "bluebird";

// Fix to avoid Typescript error...
(<any>mongoose).Promise = bluebird;

export default class Mongo {
    private connection: mongoose.Connection;

    constructor(private uri: string) {
        this.connection = mongoose.connection;
    }

    /**
     * Connect to database
     */
    async connect(): Promise<any> {
        this.connection.on("connected", () => {
            console.log("Connected to MongoDB server");
        });

        const connect = await mongoose.connect(this.uri);

        return connect;
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
