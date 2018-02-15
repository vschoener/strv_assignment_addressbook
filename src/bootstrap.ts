import * as fs from "fs";
import * as dotenv from "dotenv";

import { App } from "./app";
import Server from "./server";

const envFile = __dirname + "/../.env";
if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
}

const app = new App(
    process.env.NODE_ENV || "dev",
    process.env.NODE_PORT || "80",
    new Server()
);
app.initialize();

export default app;
