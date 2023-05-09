'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.deleteFile = exports.fileExists = exports.appendFile = exports.writeJson = exports.writeFile = exports.readDir = exports.readFile = exports.requireFile = exports.readJson = exports.projectDir = exports.directory = void 0
const path = require('path')
const fs = require('fs')
const jsonfile_1 = require('jsonfile')
exports.directory = path.resolve(__dirname, '..')
const projectDir = (...args) => {
  return path.resolve(exports.directory, ...args)
}
exports.projectDir = projectDir
const readJson = (...args) => {
  return (0, jsonfile_1.readFileSync)((0, exports.projectDir)(...args), { encoding: 'utf8' })
}
exports.readJson = readJson
const requireFile = (...args) => {
  return require((0, exports.projectDir)(...args))
}
exports.requireFile = requireFile
const readFile = (...args) => {
  return fs.readFileSync((0, exports.projectDir)(...args), { encoding: 'utf8' })
}
exports.readFile = readFile
const readDir = (...args) => {
  return fs.readdirSync((0, exports.projectDir)(...args))
}
exports.readDir = readDir
const writeFile = (data, ...args) => {
  return fs.writeFileSync((0, exports.projectDir)(...args), data, { encoding: 'utf8' })
}
exports.writeFile = writeFile
const writeJson = (data, ...args) => {
  return (0, jsonfile_1.writeFileSync)((0, exports.projectDir)(...args), data, { encoding: 'utf8' })
}
exports.writeJson = writeJson
const appendFile = (data, ...args) => {
  return fs.appendFileSync((0, exports.projectDir)(...args), data, { encoding: 'utf8' })
}
exports.appendFile = appendFile
const fileExists = (...args) => {
  return fs.existsSync((0, exports.projectDir)(...args))
}
exports.fileExists = fileExists
const deleteFile = (...args) => {
  const filepath = (0, exports.projectDir)(...args)
  if (!fs.existsSync(filepath)) { return }
  return fs.unlinkSync(filepath)
}
exports.deleteFile = deleteFile
// # sourceMappingURL=directory.js.map
