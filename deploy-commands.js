const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const dataDoc = require('./QuoteData.js')

const commands = [
  new SlashCommandBuilder() // random
    .setName('random')
    .setDescription('Generate a Random Quote from Star Wars')
    .addStringOption(option =>
                    option.setName('character')
                          .setDescription('A Random Quote by Character')
                          .setRequired(false)
                          .setChoices(dataDoc.characters)
                  )
    .addStringOption(option =>
                    option.setName('movieortrilogy')
                          .setDescription('A Random Quote by Movie or Trilogy')
                          .setRequired(false)
                        // .addChoice('All', "0")
                  		    .addChoice('Star Wars: Episode I – The Phantom Menace (1999)', '1')
                  		    .addChoice('Star Wars: Episode II – Attack of the Clones (2002)', '2')
                          .addChoice('Star Wars: Episode III – Revenge of the Sith (2005)', '3')
                  				.addChoice('Star Wars: Episode IV – A New Hope (1977)', '4')
                  				.addChoice('Star Wars: Episode V – The Empire Strikes Back (1980)', '5')
                  				.addChoice('Star Wars: Episode VI – Return of the Jedi (1983)', '6')
                  				.addChoice('Prequels', 'T1')
                  				.addChoice('Original Trilogy', 'T2')
                  ),
  new SlashCommandBuilder() // help command
    .setName('help')
    .setDescription('Here\'s how to use the bot!'),
  new SlashCommandBuilder() // prequelmeme command
    .setName('prequelsmemes')
    .setDescription('Choose your favorite meme from the Prequels!')
    .addStringOption(option =>
  									option.setName('search')
  												.setDescription('Type in your meme')
  												.setRequired(true)
  												.setChoices(dataDoc.prequelsmemes)
  								),
  new SlashCommandBuilder() // original tril meme command
    .setName('originaltrilogymemes')
    .setDescription('Choose your favorite meme from the Original Trilogy!')
    .addStringOption(option =>
  									option.setName('search')
  												.setDescription('Type in your meme')
  												.setRequired(true)
  												.setChoices(dataDoc.originaltrilogymemes)
  								)
  // ,
  // new SlashCommandBuilder() //test command
  // .setName('test')
  // .setDescription('testing functions')
]
  .map(command => command.toJSON())

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN)
// process.env.DISCORD_BOT_TOKEN
rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_CLIENTID), { body: commands })//
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error)

// process.env.DISCORD_BOT_CLIENTID
