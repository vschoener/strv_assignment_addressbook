import * as fs from "fs";
import * as dotenv from "dotenv";
import * as bluebird from "bluebird";

global.Promise = bluebird;

const envFile = __dirname + "/../.env";
if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
}

if (process.env.SECRET === undefined) {
    console.error("SECRET is missing, please set this env variable");
    process.exit(1);
}

import { App } from "./app";
import Server from "./server";
import Mongo from "./database/mongo";

const mongo = new Mongo(process.env.MONGODB_URI);

const app = new App(
    process.env.ENV || "dev",
    process.env.PORT || "8080",
    new Server(),
    mongo
);
app.initialize();

export default app;
