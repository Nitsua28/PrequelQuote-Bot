import { logger } from '../utils/logger';
import { fstat } from 'fs';
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const Auth = require('../../bot-auth.json');
const fuse = require('fuse.js');
const client = new Client();
const fs = require('fs'),
    readline = require('readline'),
    instream = fs.createReadStream('quotes.txt'),
    outstream = new (require('stream'))(),
    rl = readline.createInterface(instream, outstream);
const books = [
    {
        title: "Old Man's War",
        author: {
        firstName: 'John',
        lastName: 'Scalzi'
        }
    },
    {
        title: 'The Lock Artist',
        author: {
        firstName: 'Steve',
        lastName: 'Hamilton'
        }
    }
    ]
let options = {
    shouldSort: true,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    };
//created the map which has key:quote and value:image or gif
let quotes = new Map();
//new array to shove the keys in and iterate
var temp = new Array(30); //update number of quotes
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
    //gives the user a pm with a list of commands
    if (msg.content === ("test")) {
        const saying = new fuse(temp, options)
        const result = saying.search('Nooo')
        console.log(result.item)
    }
    if (msg.content === ("*help")) {
        const Embed = new MessageEmbed()
        .setColor('#0099ff')
	    .setTitle('Help Commands')
        .setDescription('This is a work in progress. 30 quotes so far.')
        .addFields(
            { name: 'random', value: 'Generates a random quote from the Prequels with an image or GIF.\n' },
            { name: 'good', value: 'Enunciate your approval clearly and slowly\n' },
            { name: 'ihateyou', value: 'Give your master the full force of your disapproval\n' },
            { name: 'hellothere', value: 'Say Hi to General Grevious\n' },
            { name: 'execute66', value: 'Kills all the Jedi' },
            { name: 'killyounglings', value: 'Try out Anakin\'s pastime' },
        )
        .setTimestamp();

        msg.author.send(Embed);

    }

    if (msg.content === '*execute66') {
        msg.channel.send("executing...");
        const image1 = new MessageAttachment("./images/execute66.gif")
        const image2 = new MessageAttachment("./images/jedideath1.gif")
        const image3 = new MessageAttachment("./images/aaylasecura.gif")
        const image4 = new MessageAttachment("./images/Plo_Koon.gif")
        const image5 = new MessageAttachment("./images/stass_allie.gif")
        const image6 = new MessageAttachment("./images/jeditemple.gif")
        const image7 = new MessageAttachment("./images/killyounglings.gif")
        const image8 = new MessageAttachment("./images/evillaugh.gif")
        msg.channel.send(image1);
        msg.channel.send(image2);
        msg.channel.send(image3);
        msg.channel.send(image4);
        msg.channel.send(image5);
        msg.channel.send(image6);
        msg.channel.send(image7);
        msg.channel.send(image8);
    }
    if (msg.content === "*hellothere") {
        const image = new MessageAttachment("./images/hellothere.gif")
        msg.channel.send(image);
    }
    if (msg.content === "*killyounglings") {
        const image1 = new MessageAttachment("./images/masterskywalker.gif")
        const image2 = new MessageAttachment("./images/killyounglings2.gif")
        msg.channel.send(image1);
        msg.channel.send(image2);
    }
    if (msg.content === "*ihateyou") {
        const image = new MessageAttachment("./images/ihateyou.gif")
        msg.channel.send(image);
    }
    if (msg.content === "*good") {
        const image = new MessageAttachment("./images/good.gif")
        msg.channel.send(image);
        }
    if (msg.content === "*random") {
        var randomQuote = temp[Math.floor(Math.random()* 30)];
        msg.channel.send(randomQuote);
        const image = new MessageAttachment(quotes.get(randomQuote))
        msg.channel.send(image);
    }
});

client.login(Auth.discord.token);

