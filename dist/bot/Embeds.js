const { MessageEmbed } = require('discord.js');
const helpEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help Commands')
    .setDescription('Welcome to Prequel Quote Generator! Here are our Commands and what they do!')
    .addFields({ name: '*random', value: 'Generates a random quote from the Prequels\n' }, { name: '*(actor)_(movie)', value: "Generate a quote by actor and movie separated by \"_\" replacing \"(actor)\" and \"(movie)\" respectively\n" }, { name: '*(actor)', value: "Generate a quote by actor in place of \"(actor)\"\n" }, { name: '*(movie)', value: "Generate a quote by movie in place of \"(movie)\" \n" }, { name: '*help', value: 'Gives you a list of commands\n' })
    .setTimestamp();
const quoteEmbed = new MessageEmbed()
    .setColor('#0099ff');
module.exports = { helpEmbed, quoteEmbed };
//# sourceMappingURL=embeds.js.map