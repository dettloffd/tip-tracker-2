import * as winston from 'winston'

const { combine, timestamp, printf, colorize, simple, json } = winston.format;

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    simple()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/server_error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/server_combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'PROD') {
    logger.add(new winston.transports.Console({
    level: 'silly',
      format: combine(
        colorize(),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        simple(),
      ),
    }));
  }


// const logFormat = printf(({ level, message, timestamp }) => {
//     return `${timestamp} ${level}: ${message}`;
// });