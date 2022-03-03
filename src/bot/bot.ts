import { logger } from '../utils/logger';
import { fstat } from 'fs';
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const Auth = require('../../bot-auth.json');
//const fuse = require('fuse.js');
const client = new Client();


// const fs = require('fs'),
//     readline = require('readline'),
//     instream = fs.createReadStream('quotes.txt'),
//     outstream = new (require('stream'))(),
//     rl = readline.createInterface(instream, outstream);


//discord4j for autocomplete
// async function asyncFunction() {
//   let conn;
//   try {
//
//     conn = await pool.getconnection();
//
//
//   } catch (err) {
//       throw err;
//   } finally {
//       if (conn) conn.release();
//   }
// }
//
// let options = {
//     maxPatternLength: 32,
//     minMatchCharLength: 3,
//     threshold: 0.2,
//     includeScore: true,
//     };
//created the map which has key:quote and value:image or gif
//let quotes = new Map();
//new array to shove the keys in and iterate
// var temp = new Array(30); //update number of quotes
// var count = 0;
// rl.on('line', function (line) {
//     var list = String(line).split("+");
//     quotes.set(list[0],list[1]);
//     temp[count] = list[0];
//     count++;
// });
function getRandomInt(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: "xxxxxxxx",
  accessSecretKey: "xxxx",
  region: "us-west-2",
});
const docClient = new aws.DynamoDB.DocumentClient();

client.on('ready', () => {
    logger.debug(`Bot Ready and logged in as ${client.user.tag}!`);
    console.log(`Bot Online`);
});

client.on('message', (msg) => {
    if (msg.content === ("*help")) { //user dm with all commands
      const Embed = new MessageEmbed()
        .setColor('#0099ff')
  	    .setTitle('Help Commands')
        .setDescription('Welcome to Prequel Quote Generator! Here are our Commands and what they do!')
        .addFields(
              { name: '*random', value: 'Generates a random quote from the Prequels\n' },
              { name: '*(actor)_(movie)', value: "Generate a quote by actor and movie separated by \"_\" replacing \"(actor)\" and \"(movie)\" respectively\n" },
              { name: '*(actor)', value: "Generate a quote by actor in place of \"(actor)"\n" },
              { name: '*(movie)', value: "Generate a quote by movie in place of \"(movie)\" \n" },
              { name: '*help', value: 'Gives you a list of commands\n' },
          )
        .setTimestamp();

          msg.author.send(Embed);
    }
    if (msg.content === ("*random")) {}
//     const itemCountParams = {
//    TableName: "MyTable",
//    ProjectionExpression: "postId"
// };
//let randomPostId = Items[randomItemNumber].postId;
});

client.login(Auth.discord.token);
