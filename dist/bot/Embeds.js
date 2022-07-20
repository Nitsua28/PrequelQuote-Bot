const { MessageEmbed } = require('discord.js');
const helpEmbed = new MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Prequel Quotes Generator - Commands')
  .setDescription('Welcome to Prequels Quote Generator!')
  .setThumbnail('https://cdn.discordapp.com/app-icons/591501223174209546/2d2e82027601f7ccd4005e07093e2f96.png?size=256')
  .addFields(
        { name: '/random', value: 'Generates a random quote from the Prequels. You can sort by the two fields: Character and Movie.\n' },
        { name: '/help', value: 'Shows list of commands.\n'},
        { name: '/meme', value: 'Choose your favorite meme from the Prequels.\n'}
    )
  .setTimestamp();

const quoteEmbed = new MessageEmbed()
    .setColor('#0099ff');
module.exports = { helpEmbed, quoteEmbed };
//# sourceMappingURL=embeds.js.map
