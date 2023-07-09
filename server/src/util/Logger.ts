import * as winston from 'winston'

const { combine, timestamp, colorize, simple } = winston.format;

const transports = [];

if (process.env.NODE_ENV !== 'prod') {
  // Add file transports only in non-production environment
  transports.push(
    new winston.transports.File({ filename: 'logs/server_error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/server_combined.log' }),
  );
}

// Build the console format
let consoleFormat = [timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), simple()];
if (process.env.NODE_ENV !== 'prod') {
  // Add colorize to the start of the array in non-prod environments
  consoleFormat.unshift(colorize());
}

// Add console transport in all environments
transports.push(
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'prod' ? 'info' : 'silly',
    format: combine(...consoleFormat),
  })
);

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    simple()
  ),
  transports: transports,
});