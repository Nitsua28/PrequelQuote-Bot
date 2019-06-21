import { logger } from '../utils/logger';

const { Client, MessageAttachment } = require('discord.js');
const Auth = require('../../bot-auth.json');

const client = new Client();


client.on('ready', () => {
    logger.debug(`Bot Ready and logged in as ${client.user.tag}!`);
    console.log(`Bot Online`);
});

client.on('message', (msg) => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    } else if (msg.content === "hello") {
        // const attachment = new MessageAttachment();
        // msg.channel.send(`Hello There ${msg.author}`, attachment);
        msg.channel.send('https://i.imgur.com/YBqg9JG.gifv');
    }
});

client.login(Auth.discord.token);

