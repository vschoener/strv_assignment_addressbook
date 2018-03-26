import * as winston from 'winston';
import * as fs from 'fs';

import { Context } from '../context';

export class Logger {
    logger: winston.LoggerInstance;

    constructor(private path: string, private file: string, private context: Context) {}

    initialize() {
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
        }

        const tsFormat = () => (new Date()).toLocaleTimeString();
        const logger = new (winston.Logger)({
            exitOnError: false,
            level: 'debug',
            transports: [
                new (winston.transports.File)({
                    filename:  this.file,
                    dirname: this.path,
                    timestamp: tsFormat
                }),
                new winston.transports.Console({
                    level: 'debug',
                    handleExceptions: true,
                    json: true,
                    colorize: true
                })
            ]
        });

        this.logger = logger;
    }

    log(severity: string, message: string) {
        this.logger.log(severity, message);
    }

    debug(message: string) {
        this.log('debug', message);
    }

    error(message: string) {
        this.log('error', message);
    }

    info(message: string) {
        this.log('info', message);
    }

    warn(message: string) {
        this.log('warn', message);
    }

    verbose(message: string) {
        this.log('verbose', message);
    }
}
