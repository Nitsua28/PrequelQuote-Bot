import { logger } from '../utils/logger';

const { Client, MessageAttachment } = require('discord.js');
const Auth = require('../../bot-auth.json');

const client = new Client();


client.on('ready', () => {
    logger.debug(`Bot Ready and logged in as ${client.user.tag}!`);
    console.log(`Bot Online`);
});

client.on('message', (msg) => {
    if (msg.content === 'execute 66.exe') {
        msg.channel.send('https://media.giphy.com/media/xTiIzrRyvrFijaEtY4/giphy.gif');
        msg.channel.send('https://media.giphy.com/media/uGiQnHOGRvLpu/giphy.gif');
        msg.channel.send('https://media.giphy.com/media/gr3rGWS6c7pKM/giphy.gif');
        msg.channel.send('https://media.giphy.com/media/T4TCOdAe4OOUU/giphy.gif');
        msg.channel.send('https://media.giphy.com/media/3r7yaG78CicpO/giphy.gif');
        msg.channel.send('https://media.giphy.com/media/v7iNd2YXxb12E/giphy.gif');
        msg.channel.send('https://media.giphy.com/media/3oKIPzLXQYb2Bn5PLG/giphy.gif');
    } else if (msg.content === "obiwan") {
        msg.channel.send('https://i.imgur.com/YBqg9JG.gifv');
    }
    else if (msg.content === "YOU WERE THE CHOSEN ONE") {
        msg.channel.send('https://media.giphy.com/media/Mir5fnHxvXrTa/giphy.gif');
    }
});

client.login(Auth.discord.token);

