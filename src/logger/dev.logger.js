import winston from 'winston';
import customLevelOptions from './customLevelOptions.logger.js';

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
            winston.format.colorize({colors: customLevelOptions.colors}),
            winston.format.simple()
        )
    }),
    new winston.transports.File({
        filename: './logs/errors.log',
        level: 'error',
        format: winston.format.simple()
    })
    ]
});

export default logger;