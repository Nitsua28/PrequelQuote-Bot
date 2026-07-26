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
const quoteDoc = require('../../Quotes.js');
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
function getQuote(interaction) {
    return interaction.options.getString('quote');
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
function normalizeString(str) {
    return str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, "") // Remove punctuation
        .replace(/\s+/g, " ") // Collapse multiple spaces to a single space
        .trim(); // Remove leading/trailing spaces
}
function getExtension(filename) {
    switch (true) {
        case filename.endsWith("gif"):
            return 'gif';
        case filename.endsWith("png"):
            return 'png';
        case filename.endsWith("jpg"):
            return 'jpg';
        case filename.endsWith("jpeg"):
            return 'jpeg';
        case filename.endsWith("webp"):
            return 'webp';
    }
}
function isPacificWeekend() {
    const pacificString = new Date().toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        weekday: "short"
    });
    return pacificString === "Sat" || pacificString === "Sun";
}
;
function sortChoices(arr, word) {
    return arr.sort((a, b) => {
        // Exact matches or starts-with matches take priority
        const aStart = a.toLowerCase().startsWith(word.toLowerCase());
        const bStart = b.toLowerCase().startsWith(word.toLowerCase());
        if (aStart && !bStart)
            return -1;
        if (!aStart && bStart)
            return 1;
        // Otherwise, shorter names closer to the search length come first
        return a.length - b.length;
    });
}
const docClient = new client_dynamodb_1.DynamoDBClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: "us-west-2",
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
    const charChoices = [];
    Array.from(dataDoc.characters.keys()).forEach((item) => charChoices.push(item));
    const quoteChoices = [];
    Array.from(quoteDoc.quotes.keys()).forEach((item) => quoteChoices.push(item));
    if (interaction.isAutocomplete() && interaction.commandName === 'random') {
        const focusedValue = interaction.options.getFocused();
        let filtered = charChoices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));
        if (focusedValue.length > 0)
            filtered = sortChoices(filtered, focusedValue);
        if (filtered.length > 25)
            filtered = filtered.slice(0, 25); // discord's 25 choice limit
        yield interaction.respond(filtered.map(choice => ({ name: choice, value: dataDoc.characters.get(choice) })), console.log(filtered));
    }
    else if (interaction.isAutocomplete() && interaction.commandName === 'searchquote') {
        const focusedValue = normalizeString(interaction.options.getFocused());
        let filtered = quoteChoices.filter(choice => {
            const normalizeChoice = normalizeString(choice);
            return normalizeChoice.toLowerCase().includes(focusedValue.toLowerCase());
        });
        if (focusedValue.length > 0)
            filtered = sortChoices(filtered, focusedValue);
        if (filtered.length > 25)
            filtered = filtered.slice(0, 25); // discord's 25 choice limit
        yield interaction.respond(filtered.map(choice => ({
            name: choice.length > 100 ? `${choice.substring(0, 97)}...` : choice, // discord's 100 character limit
            value: quoteDoc.quotes.get(choice)
        })));
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
    if (commandName === 'searchquote') {
        try {
            if (isPacificWeekend()) {
                const botId = interaction.client.user.id;
                const userId = interaction.user.id;
                const topGgToken = process.env.TOPGG_TOKEN;
                // Fetch vote status from the Top.gg API
                const response = yield fetch(`https://top.gg/api/bots/${botId}/check?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': topGgToken
                    }
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        return yield interaction.reply({
                            content: 'User not found on Top.gg. Please make sure you have created a Top.gg account and logged in at https://top.gg before voting!',
                            ephemeral: true
                        });
                    }
                    return yield interaction.reply({
                        content: 'Failed to connect to the voting verification server. Try again later.',
                        ephemeral: true
                    });
                }
                const data = yield response.json();
                // top.gg returns { voted: 1 } if true, or { voted: 0 } if false
                if (data.voted === 0) {
                    return yield interaction.reply({
                        embeds: [embeds.voteEmbed],
                        files: [embeds.voteImg],
                        ephemeral: true
                    });
                }
            }
            const quoteID = getQuote(interaction);
            params.paramsQuery.ExpressionAttributeValues = {
                ':id': quoteID
            };
            let queryCommand = new lib_dynamodb_1.QueryCommand(params.paramsQuery);
            docClient.send(queryCommand, function (err, data) {
                if (err) {
                    console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
                }
                else {
                    console.log('Query succeeded.');
                    data.Items.forEach(function (item) {
                        const actorPictureLinkName = dataDoc.actorPictures.get(item.Actor).toLowerCase();
                        let actorLinkExtension = getExtension(actorPictureLinkName);
                        const lowerFilename = item.GIF.toLowerCase();
                        let extension = getExtension(lowerFilename);
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
        catch (error) {
            console.error('Top.gg API error:', error);
            yield interaction.reply({
                content: 'An error occurred while checking your vote status...',
                ephemeral: true
            });
        }
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
                            let actorLinkExtension = getExtension(actorPictureLinkName);
                            const lowerFilename = item.GIF.toLowerCase();
                            let extension = getExtension(lowerFilename);
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