const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Auth = require('./bot-auth.json');
const dataDoc = require("./quoteData.js");

const commands = [
	new SlashCommandBuilder() // /random
  .setName('random')
  .setDescription('Generate a Random Quote from the Star Wars Prequels!')
  .addStringOption(option =>
                    option.setName('actor')
                          .setDescription('A Random Quote by Actor')
                          .setRequired(false)
                          .setChoices(dataDoc.actors)
                  )
  .addStringOption(option =>
                    option.setName('movie')
                          .setDescription('A Random Quote by Movie')
                          .setRequired(false)
                          .addChoice('All', "0")
			                    .addChoice('Star Wars: Episode I – The Phantom Menace (1999)', "1")
			                    .addChoice('Star Wars: Episode II – Attack of the Clones (2002)', "2")
                          .addChoice('Star Wars: Episode III – Revenge of the Sith (2005)', "3")
                    )
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(Auth.discord.token);

rest.put(Routes.applicationGuildCommands(Auth.discord.ClientID, Auth.guild.guildID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
