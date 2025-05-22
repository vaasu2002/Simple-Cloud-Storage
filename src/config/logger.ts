import winston from 'winston';
import { configs } from './config';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const timestampFormat = timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });

export const logger = winston.createLogger({
    level: configs.logging.level,
    format: combine(
        timestampFormat,
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestampFormat,
                logFormat
            )
        }),
    ]
});

export default logger;