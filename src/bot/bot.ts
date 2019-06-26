import { logger } from '../utils/logger';
import { fstat } from 'fs';
const { Client, MessageAttachment } = require('discord.js');
const Auth = require('../../bot-auth.json');
const client = new Client();
const fs = require('fs'),
    readline = require('readline'),
    instream = fs.createReadStream('quotes.txt'),
    outstream = new (require('stream'))(),
    rl = readline.createInterface(instream, outstream);
//created the map which has key:quote and value:image or gif
let quotes = new Map();
//new array to shove the keys in and iterate
var temp = new Array(30);
var count = 0;
rl.on('line', function (line) {
    var list = String(line).split("+");
    quotes.set(list[0],list[1]);
    temp[count] = list[0]; 
    count++;
});
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
    else if (msg.content === "quoteme") {
        var randomQuote = temp[Math.floor(Math.random()* 30)];
        msg.channel.send(randomQuote);
        msg.channel.send(quotes.get(randomQuote));
    }
});

client.login(Auth.discord.token);

