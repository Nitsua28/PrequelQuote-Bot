"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const { Client, GatewayIntentBits } = require('discord.js');
const dataDoc = require('../../QuoteData.js');
const embeds = require('./Embeds.js');
const params = require('./Params.js');
const path = require('path');
const s3BucketName = "starwars-gifs";
const region = "us-west-2";
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getCharacter(interaction) {
    return interaction.options.getString('character');
}
function getmovieOrTrilogy(interaction) {
    return interaction.options.getString('movieortrilogy');
}
function getMeme(interaction) {
    return interaction.options.getString('search');
}
function cleanUrlName(filename) {
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
const docClient = new client_dynamodb_1.DynamoDBClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});
const client = new Client({
    intents: [
        GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds
    ]
});
client.on('ready', () => {
    logger_1.logger.debug(`Bot Ready and logged in as ${client.user.tag}!`);
    console.log('Bot Online');
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const choices = [];
    Array.from(dataDoc.characters.keys()).forEach((item) => choices.push(item));
    if (interaction.isAutocomplete()) {
        const focusedValue = interaction.options.getFocused();
        let filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));
        if (filtered.length > 25)
            filtered = []; // discord's 25 choice limit
        yield interaction.respond(filtered.map(choice => ({ name: choice, value: dataDoc.characters.get(choice) })));
    }
    if (!interaction.isCommand())
        return;
    const { commandName } = interaction;
    if (commandName === 'help') { // help commandName
        interaction.reply({
            embeds: [embeds.helpEmbed]
        });
    }
    if (commandName === 'prequelsmemes' ||
        commandName === 'originaltrilogymemes' ||
        commandName === 'sequelsmemes') {
        //see deploy-commands.js for how the memes work
        const meme = getMeme(interaction);
        interaction.reply(`https://starwars-gifs.s3.us-west-2.amazonaws.com/${meme}`);
    }
    if (commandName === 'random') {
        const movieOrTrilogy = getmovieOrTrilogy(interaction);
        const actor = getCharacter(interaction);
        const paramsScan = {
            TableName: 'PrequelQuotes',
            ProjectionExpression: '#id',
            ExpressionAttributeNames: {
                '#id': 'ID'
            },
            ExpressionAttributeValues: {}
        };
        let filterExpression = '';
        if (!(actor == null)) { // if actor
            paramsScan.ExpressionAttributeNames['#a'] = 'Actor';
            paramsScan.ExpressionAttributeValues[':actor'] = actor;
            filterExpression += '#a = :actor';
        }
        if (!(movieOrTrilogy == null)) { // if movieOrTrilogy
            // also by Trilogy
            if (!(actor == null))
                filterExpression += ' AND ';
            switch (movieOrTrilogy[0]) {
                case 'T':
                    paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy';
                    paramsScan.ExpressionAttributeValues[':trilogy'] = movieOrTrilogy[1];
                    filterExpression += '#t = :trilogy';
                    break;
                case 'N':
                    paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy';
                    paramsScan.ExpressionAttributeValues[':trilogy1'] = '1';
                    paramsScan.ExpressionAttributeValues[':trilogy2'] = '2';
                    filterExpression += '#t IN (:trilogy1, :trilogy2)';
                    break;
                default:
                    paramsScan.ExpressionAttributeNames['#m'] = 'Movie';
                    paramsScan.ExpressionAttributeValues[':movie'] = movieOrTrilogy;
                    filterExpression += '#m = :movie';
                    break;
            }
        }
        if ((movieOrTrilogy == null) && (actor == null)) {
            //this is because I want the number of quotes generated from each trilogy to be balanced
            //for better user experience
            //original trilogy has too many quotes
            const randTrilogy = getRandomInt(1, dataDoc.TOTAL_NUMBER_OF_TRILOGIES);
            paramsScan.ExpressionAttributeNames['#t'] = 'Trilogy';
            paramsScan.ExpressionAttributeValues[':trilogy'] = randTrilogy.toString();
            filterExpression += '#t = :trilogy';
        }
        paramsScan['FilterExpression'] = filterExpression;
        let command = new lib_dynamodb_1.ScanCommand(paramsScan);
        docClient.send(command, function (err, data) {
            if (err || data.Count === 0) {
                console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
                if (data.Count === 0) {
                    interaction.reply({ content: 'No quote was found....' });
                    console.log('No Quote Found. ERROR.');
                }
            }
            else {
                console.log('Scan succeeded.');
                const randNum = getRandomInt(0, data.Count - 1);
                const randomID = data.Items[randNum].ID;
                params.paramsQuery.ExpressionAttributeValues = {
                    ':id': randomID.toString()
                };
                let queryCommand = new lib_dynamodb_1.QueryCommand(params.paramsQuery);
                console.log("sending");
                docClient.send(queryCommand, function (err, data) {
                    if (err) {
                        console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
                    }
                    else {
                        console.log('Query succeeded.');
                        data.Items.forEach(function (item) {
                            const actorPictureLinkName = dataDoc.actorPictures.get(item.Actor).toLowerCase();
                            let actorLinkExtension = '';
                            switch (true) {
                                case actorPictureLinkName.endsWith("png"):
                                    actorLinkExtension = 'png';
                                    break;
                                case actorPictureLinkName.endsWith("jpg"):
                                    actorLinkExtension = 'jpg';
                                    break;
                                case actorPictureLinkName.endsWith("jpeg"):
                                    actorLinkExtension = 'jpeg';
                                    break;
                                case actorPictureLinkName.endsWith("webp"):
                                    actorLinkExtension = 'webp';
                                    break;
                            }
                            const lowerFilename = item.GIF.toLowerCase();
                            let extension = '';
                            switch (true) {
                                case lowerFilename.endsWith("gif"):
                                    extension = 'gif';
                                    break;
                                case lowerFilename.endsWith("png"):
                                    extension = 'png';
                                    break;
                                case lowerFilename.endsWith("jpg"):
                                    extension = 'jpg';
                                    break;
                                case lowerFilename.endsWith("jpeg"):
                                    extension = 'jpeg';
                                    break;
                                case lowerFilename.endsWith("webp"):
                                    extension = 'webp';
                                    break;
                            }
                            const cleanedActorUrl = cleanUrlName(`${item.Actor}.${actorLinkExtension}`);
                            //taken from aws
                            const actorPicUrl = `https://${s3BucketName}.s3.${region}.amazonaws.com/actorpictures/${cleanedActorUrl}`;
                            const gifUrl = `https://${s3BucketName}.s3.${region}.amazonaws.com/movies/${item.ID}.${extension}`;
                            embeds.quoteEmbed
                                .setAuthor({ name: dataDoc.movies[parseInt(item.Movie)] }) // Actor
                                .setTitle(item.Actor) // movie
                                .setDescription(item.Quote) // Quote
                                .setThumbnail(actorPicUrl) // Actor picture
                                .setImage(gifUrl) // gif scene
                                .setTimestamp()
                                .setFooter({ text: item.ID });
                            interaction.reply({
                                embeds: [embeds.quoteEmbed]
                            });
                        });
                    }
                });
            }
        });
    }
}));
client.login(process.env.DISCORD_BOT_TOKEN);
//# sourceMappingURL=bot.js.map