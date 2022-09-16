import { logger } from '../utils/logger'
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
  accessKeyId: 'AKIA2YVQ44FPEP5MHXFO',
  accessSecretKey: '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',
  region: 'us-west-2'

})

const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS
  ]
})

const docClient = new aws.DynamoDB.DocumentClient()

client.on('ready', () => {
  logger.debug(`Bot Ready and logged in as ${client.user.tag}!`)
  console.log('Bot Online')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) { return }

  const { commandName } = interaction
  // console.log(options)
  if (commandName === 'help') { // help commandName
    interaction.reply({
      embeds: [embeds.helpEmbed]
    })
  }

  if (commandName === 'test') { // test a certain quote
    params.paramsQuery.ExpressionAttributeValues[':id'] = '871'// enter id
    docClient.query(params.paramsQuery, function (err, data) {
      if (err) {
        console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
      } else {
        console.log('Query succeeded.')
        data.Items.forEach(function (item) {
          embeds.quoteEmbed
            .setAuthor({ name: dataDoc.movies[parseInt(item.Movie)] })// Actor
            .setTitle(item.Actor)// movieOrTrilogy
            .setDescription(item.Quote)// Quote
            .setThumbnail(dataDoc.actorPictures.get(item.Actor))// Actor picture
            .setImage(item.GIF)// gif scene
            .setTimestamp()
            .setFooter({ text: item.ID })
        })
        interaction.reply({
          embeds: [embeds.quoteEmbed]
        })
      }
    })
  }

  if (commandName === 'prequelsmemes' || commandName === 'originaltrilogymemes') { // meme commandName
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

    // if ((movieOrTrilogy == null) && (actor == null)){ // if only random no params

    // let randomID = getRandomInt(1,dataDoc.TOTAL_NUMBER_OF_QUOTES);
    // params.paramsQuery["ExpressionAttributeValues"][":id"] = randomID.toString();
    // docClient.query(params.paramsQuery, function(err, data) {
    //
    //     if (err) {
    //         console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    //     } else {
    //         console.log("Query succeeded.");
    //         data.Items.forEach(function(item) {
    //
    //             embeds.quoteEmbed
    //             .setAuthor({name: dataDoc.movieOrTrilogys[parseInt(item.movieOrTrilogy)]})//Actor
    //             .setTitle(item.Actor)//movieOrTrilogy
    //             .setDescription(item.Quote)//Quote
    //             .setThumbnail(dataDoc.actorPictures.get(item.Actor))//Actor picture
    //             .setImage(item.GIF)//gif scene
    //             .setTimestamp()
    //             .setFooter({text:item.ID})
    //             ;
    //         });
    //         interaction.reply({
    //           embeds: [embeds.quoteEmbed]
    //         });

    if (!(movieOrTrilogy == null)) { // if movieOrTrilogy
      // also by Trilogy

      if (!(actor == null)) {
        filterExpression += ' AND '
      }

      if (movieOrTrilogy[0] === 'T') {
        paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
        paramsScan.ExpressionAttributeValues[':trilogy'] = movieOrTrilogy[1]
        filterExpression += '#t = :trilogy'
      } else {
        paramsScan.ExpressionAttributeNames['#m'] = 'Movie'
        paramsScan.ExpressionAttributeValues[':movie'] = movieOrTrilogy
        filterExpression += '#m = :movie'
      }
    }

    if ((movieOrTrilogy == null) && (actor == null)) {
      const randTrilogy = getRandomInt(1, dataDoc.TOTAL_NUMBER_OF_TRILOGIES)
      paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
      paramsScan.ExpressionAttributeValues[':trilogy'] = randTrilogy.toString()
      filterExpression += '#t = :trilogy'
    }
    paramsScan['FilterExpression'] = filterExpression
    // console.log(filterExpression)// for testing
    // console.log(paramsScan)// for testing

    docClient.scan(paramsScan, function (err, data) {
      if (err || data.Count === 0) {
        console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2))
        if (data.Count === 0) {
          interaction.reply({ content: 'No quote was found....' })
          console.log('No Quote Found. ERROR.')
        }
      } else {
        console.log('Scan succeeded.')
        // console.log(data.Count);// for testing
        // console.log(data.scannedCount);// for testing
        const randNum = getRandomInt(0, data.Count - 1)
        // console.log(data.Items) // for testing
        const randomID = data.Items[randNum].ID
        params.paramsQuery.ExpressionAttributeValues[':id'] = randomID.toString()

        docClient.query(params.paramsQuery, function (err, data) {
          if (err) {
            console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
          } else {
            console.log('Query succeeded.')
            data.Items.forEach(function (item) {
              embeds.quoteEmbed
                .setAuthor({ name: dataDoc.movies[parseInt(item.Movie)] })// Actor
                .setTitle(item.Actor)// movie
                .setDescription(item.Quote)// Quote
                .setThumbnail(dataDoc.actorPictures.get(item.Actor))// Actor picture
                .setImage(item.GIF)// gif scene
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
})

client.login('NTkxNTAxMjIzMTc0MjA5NTQ2.G1--TE.jMCySlffwSxWt4YmGDgvcMvbIG_utEC40dLTv0')// process.env.DISCORD_BOT_TOKEN);
