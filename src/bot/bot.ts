import { integer } from 'aws-sdk/clients/cloudfront'
import { logger } from '../utils/logger'
import { DynamoDBClient} from "@aws-sdk/client-dynamodb"
import { ScanCommand, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
const { Client, GatewayIntentBits} = require('discord.js')
const dataDoc = require('../../QuoteData.js')
const quoteDoc = require('../../Quotes.js')
const embeds = require('./Embeds.js')
const params = require('./Params.js')
const path = require('path');

const s3BucketName = "starwars-gifs"
const region = "us-west-2"
const DAILY_INTERVAL = 24 * 60 * 60 * 1000

function getRandomInt (min: integer, max: integer) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getChannel (interaction: any){
  return interaction.options.getChannel('target-channel')
}

function getCharacter (interaction: any) {
  return interaction.options.getString('character')
}

function getmovieOrTrilogy (interaction: any) {
  return interaction.options.getString('movieortrilogy')
}

function getMeme (interaction: any) {
  return interaction.options.getString('search')
}

function getQuote (interaction: any) {
  return interaction.options.getString('quote')
}

function cleanUrlName(filename: string) {
    
    const extension = path.extname(filename);
    const name = path.basename(filename, extension);
    
    let cleanName = name
        // 1. Replace spaces, tabs, and newlines with a single hyphen
        .replace(/\s+/g, '-')
        // 2. Remove any character that isn't a letter, number, hyphen, underscore, or period
        .replace(/[^a-zA-Z0-9_\-\.]/g, '')
        // 3. Clean up double-hyphens or double-underscores
        .replace(/-+/g, '-')
        .replace(/_+/g, '_');
        
    // 4. Strip hyphens or underscores from the very beginning or end
    cleanName = cleanName.replace(/^[-_]+|[-_]+$/g, '');
    
    // Reattach the original extension in lowercase
    return `${cleanName}${extension.toLowerCase()}`;
}

function normalizeString(str: string) {
    return str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, "") // Remove punctuation
        .replace(/\s+/g, " ")                           // Collapse multiple spaces to a single space
        .trim();                                        // Remove leading/trailing spaces
}

function getExtension (filename: string) {
  switch (true){
    case filename.endsWith("gif"):
      return 'gif'
    case filename.endsWith("png"):
      return 'png'
    case filename.endsWith("jpg"):
      return 'jpg'
    case filename.endsWith("jpeg"):
      return 'jpeg'
    case filename.endsWith("webp"):
      return 'webp'
  }
}

function isPacificWeekend (){
  const pacificString = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short"
  });
  return pacificString === "Sat" || pacificString === "Sun";
};

function sortChoices(arr: string [], word: string) {
  return arr.sort((a, b) => {
        // Exact matches or starts-with matches take priority
        const aStart = a.toLowerCase().startsWith(word.toLowerCase());
        const bStart = b.toLowerCase().startsWith(word.toLowerCase());
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        
        // Otherwise, shorter names closer to the search length come first
        return a.length - b.length;
    });
}



async function randomQuotesForSchedule(){
  const allGuildInfo: any[] = []
  let lastEvaluatedKey = undefined;

  try {
      do {
        const params: any = {
          TableName: "Autopostchannels",
          ExclusiveStartKey: lastEvaluatedKey,
        };

        const response = await docClient.send(new ScanCommand(params));
        
        // Add the current page of items to our master list
        if (response.Items) {
          allGuildInfo.push(...response.Items);
        }

        // Track the pagination token provided by DynamoDB
        lastEvaluatedKey = response.LastEvaluatedKey;

      } while (lastEvaluatedKey); // Loop stops when lastEvaluatedKey is undefined

      console.log(`Successfully retrieved all items. Total count: ${allGuildInfo.length}`);
      

    } catch (error) {
      console.error("Error scanning the table:", error);
      throw error;
    }

  for (const item of allGuildInfo){
    const channel = await client.channels.fetch(item.ChannelID);
    const movieOrTrilogy = item.MovieOrTrilogy
    const actor = item.Character

    const paramsScan: any = {
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

      if (!(actor == null)) filterExpression += ' AND '

      switch(movieOrTrilogy[0]) {
        case 'T':
          paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
          paramsScan.ExpressionAttributeValues[':trilogy'] = movieOrTrilogy[1]
          filterExpression += '#t = :trilogy'
          break;
        case 'N':
          paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
          paramsScan.ExpressionAttributeValues[':trilogy1'] = '1'
          paramsScan.ExpressionAttributeValues[':trilogy2'] = '2'
          filterExpression += '#t IN (:trilogy1, :trilogy2)'
          break;
        default:
          paramsScan.ExpressionAttributeNames['#m'] = 'Movie'
          paramsScan.ExpressionAttributeValues[':movie'] = movieOrTrilogy
          filterExpression += '#m = :movie'
          break;
      }
    }

    if ((movieOrTrilogy == null) && (actor == null)) {
      //this is because I want the number of quotes generated from each trilogy to be balanced
      //for better user experience
      //original trilogy has too many quotes
      const randTrilogy = getRandomInt(1, dataDoc.TOTAL_NUMBER_OF_TRILOGIES)
      paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
      paramsScan.ExpressionAttributeValues[':trilogy'] = randTrilogy.toString()
      filterExpression += '#t = :trilogy'
    }
    paramsScan['FilterExpression'] = filterExpression
    let command = new ScanCommand(paramsScan);

    docClient.send(command, async function (err: any, data: any) {
      if (err || data.Count === 0) {
        console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2))
        if (data.Count === 0) {
          await channel.send({ content: 'No quote was found....' })
          console.log('No Quote Found. ERROR.')
        }
      } else {
        console.log('Scan succeeded.')
        const randNum = getRandomInt(0, data.Count - 1)
        const randomID = data.Items[randNum].ID
        params.paramsQuery.ExpressionAttributeValues = {
          ':id': randomID.toString()
        } 

        let queryCommand = new QueryCommand(params.paramsQuery)
        console.log("sending")
        docClient.send(queryCommand, function (err: any, data: any) {
          if (err) {
            console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
          } else {
            console.log('Query succeeded.')
            data.Items.forEach(async function (item: any) {
              
              const actorPictureLinkName = dataDoc.actorPictures.get(item.Actor).toLowerCase()
              let actorLinkExtension = getExtension(actorPictureLinkName)
              
              const lowerFilename = item.GIF.toLowerCase()
              let extension = getExtension(lowerFilename)
              
              const cleanedActorUrl = cleanUrlName(`${item.Actor}.${actorLinkExtension}`)
              //taken from aws
              const actorPicUrl = `https://${s3BucketName}.s3.${region}.amazonaws.com/actorpictures/${cleanedActorUrl}`
              const gifUrl = `https://${s3BucketName}.s3.${region}.amazonaws.com/movies/${item.ID}.${extension}`
              
              embeds.quoteEmbed
                .setAuthor({ name: dataDoc.movies[parseInt(item.Movie)] })// Actor
                .setTitle(item.Actor)// movie
                .setDescription(item.Quote)// Quote
                .setThumbnail(actorPicUrl)// Actor picture
                .setImage(gifUrl)// gif scene
                .setTimestamp()
                .setFooter({ text: item.ID })

              await channel.send({
                embeds: [embeds.quoteEmbed]
              })
            })
          }
        })
        }
      })
  }
}

async function scheduleDailyPosts(targetHour: any, targetMinute = 0) {
    const now : any = new Date();
    const nextExecution : any = new Date();
    
    // Set the target time for today
    nextExecution.setHours(targetHour, targetMinute, 0, 0);

    // If that time has already passed today, target the same time tomorrow
    if (now > nextExecution) {
        nextExecution.setDate(nextExecution.getDate() + 1);
    }

    // Calculate how many milliseconds to wait until the first run
    const timeUntilFirstRun = nextExecution - now;

    console.log("scheduling")
    // Step 1: Wait until the exact target time: 12pm
    setTimeout(() => {

        console.log("It's time for daily!")
        randomQuotesForSchedule(); // Execute the first time

        // Step 2: Establish the 24-hour cycle from this point forward
        
        setInterval(randomQuotesForSchedule, DAILY_INTERVAL); 

    }, timeUntilFirstRun);
}

const docClient = new DynamoDBClient({
  credentials: { //! to ignore undefined
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: "us-west-2",
});

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds
  ]
})

client.on('ready', () => {
  logger.debug(`Bot Ready and logged in as ${client.user.tag}!`)
  console.log('Bot Online')
})

scheduleDailyPosts(12,0) // for noon everyday

client.on('interactionCreate', async (interaction: any) => {
  const charChoices: any [] = [];
  Array.from(dataDoc.characters.keys()).forEach((item) => charChoices.push(item));

  const quoteChoices: any [] = [];
  Array.from(quoteDoc.quotes.keys()).forEach((item) => quoteChoices.push(item));

  if (interaction.isAutocomplete() && (interaction.commandName === 'random'|| interaction.commandName === 'setautopostchannel')){ 
    const focusedValue = interaction.options.getFocused();

    let filtered = charChoices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));

    if (focusedValue.length > 0) filtered = sortChoices(filtered,focusedValue)
    if (filtered.length > 25) filtered = filtered.slice(0, 25); // discord's 25 choice limit
    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: dataDoc.characters.get(choice)})),
    );
  }
  else if (interaction.isAutocomplete() && interaction.commandName === 'searchquote'){
    const focusedValue = normalizeString(interaction.options.getFocused());

    let filtered = quoteChoices.filter(choice => {
      const normalizeChoice = normalizeString(choice)
      return normalizeChoice.toLowerCase().includes(focusedValue.toLowerCase())
    });
    
    if (focusedValue.length > 0) filtered = sortChoices(filtered,focusedValue)
    if (filtered.length > 25) filtered = filtered.slice(0, 25); // discord's 25 choice limit
    await interaction.respond(
      filtered.map(choice => (
        {
          name: choice.length > 100 ? `${choice.substring(0, 97)}...` : choice,// discord's 100 character limit
          value: quoteDoc.quotes.get(choice)
        }
    )),
      
    );
  }



  

  if (!interaction.isCommand()) return;

  const { commandName } = interaction
  
  if (commandName === 'help') { // help commandName
    interaction.reply({
      embeds: [embeds.helpEmbed]
    })
  }

  if (commandName === 'setautopostchannel') { // setting channel to auto post random quotes

    // Extract the selected channel object
    const selectedChannel = getChannel(interaction);
    const selectedCharacter = getCharacter(interaction);
    const selectedMovorTri = getmovieOrTrilogy(interaction);

    // Save the channel ID for this specific server
    try{
          await docClient.send(new PutCommand({
          TableName: "Autopostchannels",
          Item: {
              GuildID: interaction.guildId,
              ChannelID: selectedChannel.id,
              Character: selectedCharacter,
              MovieOrTrilogy: selectedMovorTri
              
          }
      }));
    }
    catch (error) {
      console.error("Error setting the channel:", error);
      throw error;
    }

    await interaction.reply({ 
        content: `Auto-post channel has been successfully set to ${selectedChannel}!`, 
        ephemeral: true // Only visible to the user who ran it
    });
    
  }

  if (commandName === 'prequelsmemes' || 
      commandName === 'originaltrilogymemes' ||
      commandName === 'sequelsmemes') 
  {
    //see deploy-commands.js for how the memes work
    const meme = getMeme(interaction)
    
    interaction.reply(`https://starwars-gifs.s3.us-west-2.amazonaws.com/${meme}`)
  }

  if (commandName === 'searchquote'){

    try {

        if (isPacificWeekend()){

          const botId = interaction.client.user.id;
          const userId = interaction.user.id;
          const topGgToken = process.env.TOPGG_TOKEN!;
            // Fetch vote status from the Top.gg API
          const response = await fetch(`https://top.gg/api/bots/${botId}/check?userId=${userId}`, {
              method: 'GET',
              headers: {
                  'Authorization': topGgToken
              }
          });

          if (!response.ok) {
              if (response.status === 404) {
                return await interaction.reply({ 
                  content: 'User not found on Top.gg. Please make sure you have created a Top.gg account and logged in at https://top.gg before voting!', 
                  ephemeral: true 
              });
    }
              return await interaction.reply({ 
                  content: 'Failed to connect to the voting verification server. Try again later.', 
                  ephemeral: true 
              });
          }

          const data = await response.json();

          // top.gg returns { voted: 1 } if true, or { voted: 0 } if false
          if (data.voted === 0) {
              return await interaction.reply({
                  embeds: [embeds.voteEmbed],
                  files: [embeds.voteImg],
                  ephemeral: true
              });
          }

          
        }

        const quoteID = getQuote(interaction)

        params.paramsQuery.ExpressionAttributeValues = {
              ':id': quoteID
            } 

        let queryCommand = new QueryCommand(params.paramsQuery)

        docClient.send(queryCommand, function (err: any, data: any) {
              if (err) {
                console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
              } else {
                console.log('Query succeeded.')
                data.Items.forEach(function (item: any) {
                  const actorPictureLinkName = dataDoc.actorPictures.get(item.Actor).toLowerCase()
                  let actorLinkExtension = getExtension(actorPictureLinkName)
                  
                  const lowerFilename = item.GIF.toLowerCase()
                  let extension = getExtension(lowerFilename)
                  
                  const cleanedActorUrl = cleanUrlName(`${item.Actor}.${actorLinkExtension}`)
                  //taken from aws
                  const actorPicUrl = `https://${s3BucketName}.s3.${region}.amazonaws.com/actorpictures/${cleanedActorUrl}`
                  const gifUrl = `https://${s3BucketName}.s3.${region}.amazonaws.com/movies/${item.ID}.${extension}`
                  
                  embeds.quoteEmbed
                    .setAuthor({ name: dataDoc.movies[parseInt(item.Movie)] })// Actor
                    .setTitle(item.Actor)// movie
                    .setDescription(item.Quote)// Quote
                    .setThumbnail(actorPicUrl)// Actor picture
                    .setImage(gifUrl)// gif scene
                    .setTimestamp()
                    .setFooter({ text: item.ID })

                  interaction.reply({
                    embeds: [embeds.quoteEmbed]
                  })
                })

              }
        })
        
        

    } catch (error) {
        console.error('Top.gg API error:', error);
        await interaction.reply({ 
            content: 'An error occurred while checking your vote status...', 
            ephemeral: true 
        });
    }

    
  }
  if (commandName === 'random') {
    const movieOrTrilogy = getmovieOrTrilogy(interaction)
    const actor = getCharacter(interaction)

    const paramsScan: any = {
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

      if (!(actor == null)) filterExpression += ' AND '

      switch(movieOrTrilogy[0]) {
        case 'T':
          paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
          paramsScan.ExpressionAttributeValues[':trilogy'] = movieOrTrilogy[1]
          filterExpression += '#t = :trilogy'
          break;
        case 'N':
          paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
          paramsScan.ExpressionAttributeValues[':trilogy1'] = '1'
          paramsScan.ExpressionAttributeValues[':trilogy2'] = '2'
          filterExpression += '#t IN (:trilogy1, :trilogy2)'
          break;
        default:
          paramsScan.ExpressionAttributeNames['#m'] = 'Movie'
          paramsScan.ExpressionAttributeValues[':movie'] = movieOrTrilogy
          filterExpression += '#m = :movie'
          break;
      }
    }

    if ((movieOrTrilogy == null) && (actor == null)) {
      //this is because I want the number of quotes generated from each trilogy to be balanced
      //for better user experience
      //original trilogy has too many quotes
      const randTrilogy = getRandomInt(1, dataDoc.TOTAL_NUMBER_OF_TRILOGIES)
      paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy'
      paramsScan.ExpressionAttributeValues[':trilogy'] = randTrilogy.toString()
      filterExpression += '#t = :trilogy'
    }
    paramsScan['FilterExpression'] = filterExpression
    let command = new ScanCommand(paramsScan);

    docClient.send(command, function (err: any, data: any) {
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
        params.paramsQuery.ExpressionAttributeValues = {
          ':id': randomID.toString()
        } 

        let queryCommand = new QueryCommand(params.paramsQuery)
        console.log("sending")
        docClient.send(queryCommand, function (err: any, data: any) {
          if (err) {
            console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
          } else {
            console.log('Query succeeded.')
            data.Items.forEach(function (item: any) {
              
              const actorPictureLinkName = dataDoc.actorPictures.get(item.Actor).toLowerCase()
              let actorLinkExtension = getExtension(actorPictureLinkName)
              
              const lowerFilename = item.GIF.toLowerCase()
              let extension = getExtension(lowerFilename)
              
              const cleanedActorUrl = cleanUrlName(`${item.Actor}.${actorLinkExtension}`)
              //taken from aws
              const actorPicUrl = `https://${s3BucketName}.s3.${region}.amazonaws.com/actorpictures/${cleanedActorUrl}`
              const gifUrl = `https://${s3BucketName}.s3.${region}.amazonaws.com/movies/${item.ID}.${extension}`
              
              embeds.quoteEmbed
                .setAuthor({ name: dataDoc.movies[parseInt(item.Movie)] })// Actor
                .setTitle(item.Actor)// movie
                .setDescription(item.Quote)// Quote
                .setThumbnail(actorPicUrl)// Actor picture
                .setImage(gifUrl)// gif scene
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

client.login(process.env.DISCORD_BOT_TOKEN);
