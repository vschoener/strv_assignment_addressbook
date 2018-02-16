import * as fs from "fs";
import * as dotenv from "dotenv";

import { App } from "./app";
import Server from "./server";

const envFile = __dirname + "/../.env";
if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
}

const app = new App(
    process.env.ENV || "dev",
    process.env.PORT || "8080",
    new Server()
);
app.initialize();

export default app;
