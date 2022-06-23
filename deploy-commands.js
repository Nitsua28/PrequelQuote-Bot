const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dataDoc = require("./QuoteData.js");

const commands = [
	new SlashCommandBuilder() // /random
  .setName('random')
  .setDescription('Generate a Random Quote from the Star Wars Prequels!')
  .addStringOption(option =>
                    option.setName('character')
                          .setDescription('A Random Quote by Character')
                          .setRequired(false)
                          .setChoices(dataDoc.characters)
                  )
  .addStringOption(option =>
                    option.setName('movie')
                          .setDescription('A Random Quote by Movie')
                          .setRequired(false)
                          .addChoice('All', "0")
			                    .addChoice('Star Wars: Episode I – The Phantom Menace (1999)', "1")
			                    .addChoice('Star Wars: Episode II – Attack of the Clones (2002)', "2")
                          .addChoice('Star Wars: Episode III – Revenge of the Sith (2005)', "3")
                    ),
	new SlashCommandBuilder() // help command
	.setName('help')
	.setDescription('Here\'s how to use the bot')
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken("");
//process.env.DISCORD_BOT_TOKEN
rest.put(Routes.applicationCommands(""), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
//process.env.DISCORD_BOT_CLIENTID
