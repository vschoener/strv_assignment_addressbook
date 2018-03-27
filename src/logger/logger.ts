import * as winston from 'winston';
import * as fs from 'fs';

export interface LoggerSettingsInterface {
    fileDirectory: string;
    fileName: string;
    logLevel: string;
    jsonFormat: boolean;
    handleException: boolean;
    colorize: boolean;
}

export class Logger {
    logger: winston.LoggerInstance;

    initialize(settings: LoggerSettingsInterface) {
        if (!fs.existsSync(settings.fileDirectory)) {
            fs.mkdirSync(settings.fileDirectory);
        }

        const tsFormat = () => (new Date()).toISOString();
        const logger = new (winston.Logger)({
            level: settings.logLevel,
            transports: [
                new (winston.transports.File)({
                    filename:  settings.fileName,
                    dirname: settings.fileDirectory,
                    timestamp: tsFormat
                }),
                new winston.transports.Console({
                    handleExceptions: settings.handleException,
                    json: settings.jsonFormat,
                    colorize: settings.colorize
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
