import { logger } from '../utils/logger';
import { fstat } from 'fs';
const {Client,Intents}= require('discord.js');
const dataDoc = require("../../QuoteData.js");
const embeds = require("./Embeds.js");
const params = require("./Params.js");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCharacter(interaction){
  return interaction.options.getString("character");
}

function getMovie(interaction){
  return interaction.options.getString("movie");
}
const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_ACCESS_REGION,

});

const client = new Client({
    intents: [
      Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILDS
    ],
});

const docClient = new aws.DynamoDB.DocumentClient();

client.on('ready', () => {
    logger.debug(`Bot Ready and logged in as ${client.user.tag}!`);
    console.log(`Bot Online`);


});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()){return}

  const {commandName, options} = interaction;
  //console.log(options)
  if (commandName === "random"){
    var movie = getMovie(interaction);
    var actor = getCharacter(interaction);

    if ((movie == null) && (actor == null)){ // if only random
      let randomID = getRandomInt(1,dataDoc.TOTAL_NUMBER_OF_QUOTES);
      params.paramsQuery["ExpressionAttributeValues"][":id"] = randomID.toString();
      docClient.query(params.paramsQuery, function(err, data) {

          if (err) {
              console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
          } else {
              console.log("Query succeeded.");
              data.Items.forEach(function(item) {

                  embeds.quoteEmbed
                  .setAuthor({name: dataDoc.movies[parseInt(item.Movie)]})//Actor
                  .setTitle(item.Actor)//Movie
                  .setDescription(item.Quote)//Quote
                  .setThumbnail(dataDoc.actorPictures.get(item.Actor))//Actor picture
                  .setImage(item.GIF)//gif scene
                  .setTimestamp()
                  .setFooter({text:item.ID})
                  ;
              });
              interaction.reply({
                embeds: [embeds.quoteEmbed]
              });
          }
      });
    }
    else{
      var paramsScan = {
          TableName: "PrequelQuotes",
          ProjectionExpression: "#id",
          ExpressionAttributeNames:{
            "#id": "ID"
          },
          ExpressionAttributeValues:{}
      };
      var filterExpression = "";

      if (!(actor == null)){ //if actor

        paramsScan["ExpressionAttributeNames"]["#a"] = "Actor";
        paramsScan["ExpressionAttributeValues"][":actor"] = actor;
        filterExpression += "#a = :actor";
      }

      if (!(movie == null)){ // if movie
        var startID;
        var endID;
        switch(movie) {
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
        }

        paramsScan["ExpressionAttributeValues"][":startID"] = startID.toString();
        paramsScan["ExpressionAttributeValues"][":endID"] = endID.toString();
        if (!(actor == null)){
          filterExpression += " AND "
        }
        filterExpression += "#id between :startID and :endID";
      }
      paramsScan["FilterExpression"] = filterExpression;
      // console.log(filterExpression)
      // console.log(paramsScan)

      docClient.scan(paramsScan, function(err, data) {

          if (err || data.Count == 0) {
              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
              if (data.Count == 0) {
                interaction.reply({content: "No quote was found...."});
                console.log("No Quote Found. ERROR.")
              }

          } else {
              console.log("Scan succeeded.");
              // console.log(data.Count);
              // console.log(data.scannedCount);
              let randNum = getRandomInt(0,data.Count - 1);
              // console.log(data.Items)
              let randomID = data.Items[randNum]["ID"]
              params.paramsQuery["ExpressionAttributeValues"][":id"] = randomID.toString();

              docClient.query(params.paramsQuery, function(err, data) {
                  if (err) {
                      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                  } else {
                      console.log("Query succeeded.");
                      data.Items.forEach(function(item) {
                          embeds.quoteEmbed
                          .setAuthor({name: dataDoc.movies[parseInt(item.Movie)]})//Actor
                          .setTitle(item.Actor)//Movie
                          .setDescription(item.Quote)//Quote
                          .setThumbnail(dataDoc.actorPictures.get(item.Actor))//Actor picture
                          .setImage(item.GIF)//gif scene
                          .setTimestamp()
                          .setFooter({text:item.ID})
                          ;

                          interaction.reply({
                            embeds: [embeds.quoteEmbed]
                          });
                      });
                  }
              });
          }
      });
  }
}


});


client.login(process.env.DISCORD_BOT_TOKEN);
