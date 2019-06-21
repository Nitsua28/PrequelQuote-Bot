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
    } else if (msg.content === "obiwan") {
        msg.channel.send('https://i.imgur.com/YBqg9JG.gifv');
    }
    else if (msg.content === "YOU WERE THE CHOSEN ONE") {
        msg.channel.send('https://media.giphy.com/media/Mir5fnHxvXrTa/giphy.gif');
    }
});

client.login(Auth.discord.token);

