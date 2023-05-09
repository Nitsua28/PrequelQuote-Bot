'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.logger = void 0
const winston_1 = require('winston')
const directory_1 = require('../directory')
const { Console, File } = winston_1.transports
const { combine, timestamp, printf } = winston_1.format
const oneLineFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] (${level}): ${message}`
})
const logger = (0, winston_1.createLogger)({
  level: 'debug',
  format: combine(timestamp(), oneLineFormat),
  transports: [
    new Console(),
    new File({ filename: 'bot.log', dirname: directory_1.directory, maxsize: 1e+7 })
  ]
})
exports.logger = logger
// # sourceMappingURL=logger.js.map
