'use strict'
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt (value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
    function rejected (value) { try { step(generator.throw(value)) } catch (e) { reject(e) } }
    function step (result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
Object.defineProperty(exports, '__esModule', { value: true })
const logger_1 = require('../utils/logger')
const { Client, Intents } = require('discord.js')
const dataDoc = require('../../QuoteData.js')
const embeds = require('./Embeds.js')
const params = require('./Params.js')
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function getCharacter (interaction) {
  return interaction.options.getString('character')
}
function getmovieOrTrilogy (interaction) {
  return interaction.options.getString('movieortrilogy')
}
function getMeme (interaction) {
  return interaction.options.getString('search')
}
const aws = require('aws-sdk')
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // process.env.AWS_ACCESS_KEY_ID
  accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY, // process.env.AWS_SECRET_ACCESS_KEY
  region: process.env.AWS_ACCESS_REGION // process.env.AWS_ACCESS_REGION
})
const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS
  ]
})
const docClient = new aws.DynamoDB.DocumentClient()
client.on('ready', () => {
  logger_1.logger.debug(`Bot Ready and logged in as ${client.user.tag}!`)
  console.log('Bot Online')
})
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function * () {
  const choices = []
  Array.from(dataDoc.characters.keys()).forEach((item) => choices.push(item))
  if (interaction.isAutocomplete()) {
    const focusedValue = interaction.options.getFocused()
    let filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()))
    if (filtered.length > 25) { filtered = [] } // discord's 25 choice limit
    yield interaction.respond(filtered.map(choice => ({ name: choice, value: dataDoc.characters.get(choice) })))
  }
  if (!interaction.isCommand()) { return }
  const { commandName } = interaction
  // console.log(options)
  if (commandName === 'help') { // help commandName
    interaction.reply({
      embeds: [embeds.helpEmbed]
    })
  }
  // if (commandName === 'test') { // test a certain quote
  //   params.paramsQuery.ExpressionAttributeValues[':id'] = '871'// enter id
  //   docClient.query(params.paramsQuery, function (err, data) {
  //     if (err) {
  //       console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
  //     } else {
  //       console.log('Query succeeded.')
  //       data.Items.forEach(function (item) {
  //         embeds.quoteEmbed
  //           .setAuthor({ name: dataDoc.movies[parseInt(item.Movie)] })// Actor
  //           .setTitle(item.Actor)// movieOrTrilogy
  //           .setDescription(item.Quote)// Quote
  //           .setThumbnail(dataDoc.actorPictures.get(item.Actor))// Actor picture
  //           .setImage(item.GIF)// gif scene
  //           .setTimestamp()
  //           .setFooter({ text: item.ID })
  //       })
  //       interaction.reply({
  //         embeds: [embeds.quoteEmbed]
  //       })
  //     }
  //   })
  // }
  if (commandName === 'prequelsmemes' ||
        commandName === 'originaltrilogymemes' ||
        commandName === 'sequelsmemes') {
    // meme commandName
    const meme = getMeme(interaction)
    interaction.reply(meme)
  }
  if (commandName === 'random') {
    const movieOrTrilogy = getmovieOrTrilogy(interaction)
    const actor = getCharacter(interaction)
    const paramsScan = {
      TableName: 'PrequelQuotes',
      ProjectionExpression: '#id',
      ExpressionAttributeNames: {
        '#id': 'ID'
      },
      ExpressionAttributeValues: {}
    }
    let filterExpression = ''
    if (!(actor == null)) { // if actor
      paramsScan.ExpressionAttributeNames['#a'] = 'Actor'
      paramsScan.ExpressionAttributeValues[':actor'] = actor
      filterExpression += '#a = :actor'
    }
    if (!(movieOrTrilogy == null)) { // if movieOrTrilogy
      // also by Trilogy
      if (!(actor == null)) { filterExpression += ' AND ' }
      switch (movieOrTrilogy[0]) {
        case 'T':
          paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
          paramsScan.ExpressionAttributeValues[':trilogy'] = movieOrTrilogy[1]
          filterExpression += '#t = :trilogy'
          break
        case 'N':
          paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
          paramsScan.ExpressionAttributeValues[':trilogy1'] = '1'
          paramsScan.ExpressionAttributeValues[':trilogy2'] = '2'
          filterExpression += '#t IN (:trilogy1, :trilogy2)'
          break
        default:
          paramsScan.ExpressionAttributeNames['#m'] = 'Movie'
          paramsScan.ExpressionAttributeValues[':movie'] = movieOrTrilogy
          filterExpression += '#m = :movie'
          break
      }
    }
    if ((movieOrTrilogy == null) && (actor == null)) {
      // this is because I want the number of quotes generated from each trilogy to be balanced
      // for better user experience
      // original trilogy has too many quotes
      const randTrilogy = getRandomInt(1, dataDoc.TOTAL_NUMBER_OF_TRILOGIES)
      paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
      paramsScan.ExpressionAttributeValues[':trilogy'] = randTrilogy.toString()
      filterExpression += '#t = :trilogy'
    }
    paramsScan.FilterExpression = filterExpression
    docClient.scan(paramsScan, function (err, data) {
      if (err || data.Count === 0) {
        console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2))
        if (data.Count === 0) {
          interaction.reply({ content: 'No quote was found....' })
          console.log('No Quote Found. ERROR.')
        }
      } else {
        console.log('Scan succeeded.')
        const randNum = getRandomInt(0, data.Count - 1)
        const randomID = data.Items[randNum].ID
        params.paramsQuery.ExpressionAttributeValues[':id'] = randomID.toString()
        docClient.query(params.paramsQuery, function (err, data) {
          if (err) {
            console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
          } else {
            console.log('Query succeeded.')
            data.Items.forEach(function (item) {
              embeds.quoteEmbed
                .setAuthor({ name: dataDoc.movies[parseInt(item.Movie)] }) // Actor
                .setTitle(item.Actor) // movie
                .setDescription(item.Quote) // Quote
                .setThumbnail(dataDoc.actorPictures.get(item.Actor)) // Actor picture
                .setImage(item.GIF) // gif scene
                .setTimestamp()
                .setFooter({ text: item.ID })
              interaction.reply({
                embeds: [embeds.quoteEmbed]
              })
            })
          }
        })
      }
    })
  }
}))
client.login(process.env.DISCORD_BOT_TOKEN) // process.env.DISCORD_BOT_TOKEN);
// # sourceMappingURL=bot.js.map
