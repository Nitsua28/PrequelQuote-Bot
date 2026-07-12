
const { SlashCommandBuilder, REST, Routes } = require('discord.js');
const dataDoc = require('./QuoteData.js')

const formatChoices = (memeArray) => {
  return memeArray
    .map(([name, value]) => ({ name, value }));
};

const commands = [
  new SlashCommandBuilder() // random
    .setName('random')
    .setDescription('Generate a Random Quote from Star Wars')
    .addStringOption(option =>
      option.setName('character')
        .setDescription('A Random Quote by Character')
        .setRequired(false)
        .setAutocomplete(true)
    )

    .addStringOption(option =>
      option.setName('movieortrilogy')
        .setDescription('A Random Quote by Movie or Trilogy')
        .setRequired(false)
        .addChoices(
          { name: 'Star Wars: Episode I – The Phantom Menace (1999)', value: '1' },
          { name: 'Star Wars: Episode II – Attack of the Clones (2002)', value: '2' },
          { name: 'Star Wars: Episode III – Revenge of the Sith (2005)', value: '3' },
          { name: 'Star Wars: Episode IV – A New Hope (1977)', value: '4' },
          { name: 'Star Wars: Episode V – The Empire Strikes Back (1980)', value: '5' },
          { name: 'Star Wars: Episode VI – Return of the Jedi (1983)', value: '6' },
          { name: 'Star Wars: Episode VII – The Force Awakens (2015)', value: '7' },
          { name: 'Star Wars: Episode VIII – The Last Jedi (2017)', value: '8' },
          { name: 'Star Wars: Episode IX – The Rise of Skywalker (2019)', value: '9' },
          { name: 'Prequels', value: 'T1' },
          { name: 'Original Trilogy', value: 'T2' },
          { name: 'Sequels', value: 'T3' },
          { name: 'PreDisney Era', value: 'N' }
        )
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
  												.addChoices(...dataDoc.prequelsmemes)
  								),
  new SlashCommandBuilder() // original tril meme command
    .setName('originaltrilogymemes')
    .setDescription('Choose your favorite meme from the Original Trilogy!')
    .addStringOption(option =>
  									option.setName('search')
  												.setDescription('Type in your meme')
  												.setRequired(true)
  												.addChoices(...dataDoc.originaltrilogymemes)
  								),
  new SlashCommandBuilder() // sequels meme command
    .setName('sequelsmemes')
    .setDescription('Choose your favorite meme from the Sequels!')
    .addStringOption(option =>
                    option.setName('search')
                          .setDescription('Type in your meme')
                          .setRequired(true)
                          .addChoices(...dataDoc.sequelsmemes)
    )
  // ,
  // new SlashCommandBuilder() //test command
  // .setName('test')
  // .setDescription('testing functions')
]
  .map(command => command.toJSON())

const rest = new REST({ version: '10' }).setToken('');
// process.env.DISCORD_BOT_TOKEN
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(''), 
      { body: commands }
    );

    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();

// process.env.DISCORD_BOT_CLIENTID
