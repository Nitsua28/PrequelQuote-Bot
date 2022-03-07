import { logger } from '../utils/logger';
import { fstat } from 'fs';
const { Client } = require('discord.js');
const Auth = require('../../bot-auth.json');
const dataDoc = require("../../quoteData.js");
const embeds = require("./embeds.js");
const params = require("./params.js");

function getRandomInt(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}

const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: Auth.aws.accessKeyId,
  accessSecretKey: Auth.aws.accessSecretKey,
  region: Auth.aws.region,
});

const client = new Client();
const docClient = new aws.DynamoDB.DocumentClient();
client.on('ready', () => {
    logger.debug(`Bot Ready and logged in as ${client.user.tag}!`);
    console.log(`Bot Online`);
});
client.on('message', (msg) => {
    if (msg.content[0] === ("*")){
      let content = msg.content.substring(1);

      if (content === ("help")) msg.author.send(embeds.helpEmbed);

      if (content === ("random")) {
        let randomID = getRandomInt(1,dataDoc.TOTAL_NUMBER_OF_QUOTES);
        params.paramsQuery["ExpressionAttributeValues"][":id"] = randomID.toString();

        docClient.query(params.paramsQuery, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log("Query succeeded.");
                data.Items.forEach(function(item) {

                    embeds.quoteEmbed
                    .setAuthor(dataDoc.movies[parseInt(item.Movie)])//Actor
                    .setTitle(item.Actor)//Movie
                    .setDescription(item.Quote)//Quote
                    .setThumbnail("https://upload.wikimedia.org/wikipedia/en/b/bf/Mace_Windu.png")//Actor picture
                    .setImage("https://media.giphy.com/media/hb9bAzezYiiRi/giphy.gif")//gif scene
                    .setTimestamp();

                    msg.channel.send(embeds.quoteEmbed)
                });
            }
        });

        }
      if (content.includes("_")){
        content.split("_")
      }
      if (content ===("Yoda")){ //if actor
        params.paramsScan["ExpressionAttributeNames"]["#a"] = "Actor";
        params.paramsScan["ExpressionAttributeValues"][":actor"] = content;
        params.paramsScan["FilterExpression"] = "#a = :actor";

        docClient.scan(params.paramsScan, function(err, data) {
            if (err) {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                // print all the movies
                console.log("Scan succeeded.");

                let randNum = getRandomInt(1,data.Count);
                let randomID = data.Items[randNum]["ID"]
                params.paramsQuery["ExpressionAttributeValues"][":id"] = randomID.toString();

                docClient.query(params.paramsQuery, function(err, data) {
                    if (err) {
                        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("Query succeeded.");
                        data.Items.forEach(function(item) {

                            embeds.quoteEmbed
                            .setAuthor(dataDoc.movies[parseInt(item.Movie)])//Actor
                            .setTitle(item.Actor)//Movie
                            .setDescription(item.Quote)//Quote
                            .setThumbnail("https://upload.wikimedia.org/wikipedia/en/b/bf/Mace_Windu.png")//Actor picture
                            .setImage("https://media.giphy.com/media/hb9bAzezYiiRi/giphy.gif")//gif scene
                            .setTimestamp();

                            msg.channel.send(embeds.quoteEmbed)
                        });
                    }
                });
            }
        });
      }
      if (content ===("1")){ //if actor
        var startID;
        var endID;
        switch(content) {
          case "0":
            startID = 1;
            endID = 1;
            break;
          case "1":
            startID = 2
            endID = dataDoc.LAST_ID_OF_FIRST_MOVIE;
            break;
          case "2":
            startID = dataDoc.LAST_ID_OF_FIRST_MOVIE + 1;
            endID = dataDoc.LAST_ID_OF_SECOND_MOVIE;
            break;
          case "3":
            startID = dataDoc.LAST_ID_OF_SECOND_MOVIE + 1;
            endID = dataDoc.LAST_ID_OF_THIRD_MOVIE;
            break;
          default:
            //throw error
        }
        let randomID = getRandomInt(startID,endID);
        params.paramsQuery["ExpressionAttributeValues"][":id"] = randomID.toString();

        docClient.query(params.paramsQuery, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log("Query succeeded.");
                data.Items.forEach(function(item) {

                    embeds.quoteEmbed
                    .setAuthor(dataDoc.movies[parseInt(item.Movie)])//Actor
                    .setTitle(item.Actor)//Movie
                    .setDescription(item.Quote)//Quote
                    .setThumbnail("https://upload.wikimedia.org/wikipedia/en/b/bf/Mace_Windu.png")//Actor picture
                    .setImage("https://media.giphy.com/media/hb9bAzezYiiRi/giphy.gif")//gif scene
                    .setTimestamp();

                    msg.channel.send(embeds.quoteEmbed)
                });
            }
        });
      }

    }

//     const itemCountParams = {
//    TableName: "MyTable",
//    ProjectionExpression: "postId"
// };
//let randomPostId = Items[randomItemNumber].postId;
});

client.login(Auth.discord.token);
