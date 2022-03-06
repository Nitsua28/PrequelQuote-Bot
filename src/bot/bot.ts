import { logger } from '../utils/logger';
import { fstat } from 'fs';
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const Auth = require('../../bot-auth.json');
const client = new Client();
const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: "",
  accessSecretKey: "",
  region: "us-west-2",
});
const docClient = new aws.DynamoDB.DocumentClient();

const TOTAL_NUMBER_OF_QUOTES = 685

const helpEmbed = new MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Help Commands')
  .setDescription('Welcome to Prequel Quote Generator! Here are our Commands and what they do!')
  .addFields(
        { name: '*random', value: 'Generates a random quote from the Prequels\n' },
        { name: '*(actor)_(movie)', value: "Generate a quote by actor and movie separated by \"_\" replacing \"(actor)\" and \"(movie)\" respectively\n" },
        { name: '*(actor)', value: "Generate a quote by actor in place of \"(actor)\"\n" },
        { name: '*(movie)', value: "Generate a quote by movie in place of \"(movie)\" \n" },
        { name: '*help', value: 'Gives you a list of commands\n' },
    )
  .setTimestamp();

const quoteEmbed = new MessageEmbed()
  .setColor('#0099ff')


const dataDoc = require("../../quoteData.js")

function getRandomInt(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}

client.on('ready', () => {
    logger.debug(`Bot Ready and logged in as ${client.user.tag}!`);
    console.log(`Bot Online`);
});
client.on('message', (msg) => {
    if (msg.content === ("test")) console.log(dataDoc.actors);
    if (msg.content === ("*help")) msg.author.send(helpEmbed);
    if (msg.content === ("*random")) {
      let randomID = getRandomInt(1,TOTAL_NUMBER_OF_QUOTES);

      var params = {
          TableName : "PrequelQuotes",
          KeyConditionExpression: "#id = :id",
          ExpressionAttributeNames:{
              "#id": "ID"
          },
          ExpressionAttributeValues: {
              ":id": randomID.toString()
          }
      };

      docClient.query(params, function(err, data) {
          if (err) {
              console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
          } else {
              console.log("Query succeeded.");
              data.Items.forEach(function(item) {

                  // msg.channel.send(item.Actor+ ":" + item.Movie + ":" + item.Quote);
                  let file = new MessageAttachment('./images/ani_henngg.jpg')
                  quoteEmbed
                  .setAuthor(dataDoc.movies[parseInt(item.Movie)])//Actor
                  .setTitle(item.Actor)//Movie
                  .setDescription(item.Quote)//Quote
                  .setThumbnail("https://upload.wikimedia.org/wikipedia/en/b/bf/Mace_Windu.png")//Actor picture
                  .setImage("https://media.giphy.com/media/hb9bAzezYiiRi/giphy.gif")//gif scene
                  .setTimestamp();

                  msg.channel.send(quoteEmbed)
              });
          }
      });

      }
//     const itemCountParams = {
//    TableName: "MyTable",
//    ProjectionExpression: "postId"
// };
//let randomPostId = Items[randomItemNumber].postId;
});

client.login(Auth.discord.token);
