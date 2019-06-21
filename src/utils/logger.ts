import { createLogger, transports, format } from 'winston';
import { directory } from '../directory';
const { Console, File } = transports;
const { combine, timestamp, printf } = format;

const oneLineFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] (${level}): ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        oneLineFormat
    ),
    transports: [
        new Console(),
        new File({ filename: 'bot.log', dirname: directory, maxsize: 1e+7 })
    ]
})

export { logger };