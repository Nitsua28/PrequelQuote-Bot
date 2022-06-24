const { MessageEmbed } = require('discord.js');
const helpEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help Commands')
    .setDescription('Welcome to Prequels Quote Generator! This version is currently in BETA and features one command.')
    .addFields(
          { name: '/random', value: 'Generates a random quote from the Prequels. You can sort by the two fields: Character and Movie.\n' },
          { name: '/help', value: 'Shows list of commands.'}
      )
    .setTimestamp();
    
const quoteEmbed = new MessageEmbed()
    .setColor('#0099ff');
module.exports = { helpEmbed, quoteEmbed };
//# sourceMappingURL=embeds.js.map
