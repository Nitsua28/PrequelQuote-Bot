const { MessageEmbed } = require('discord.js')

const helpEmbed = new MessageEmbed()
  .setColor('#0099ff')
  .setTitle('PrequelsQuoteGenerator - Commands')
  .setDescription('Welcome to Star Wars Prequels Quote Generator!')
  .setThumbnail('https://cdn.discordapp.com/app-icons/591501223174209546/2d2e82027601f7ccd4005e07093e2f96.png?size=256')
  .addFields(
    { name: '/random', value: 'Generates a random quote from Star Wars! You can sort by Character, Movie, Trilogy or preDisney option.\n' },
    { name: '/help', value: 'Shows list of commands.\n' },
    { name: '/originaltrilogymemes', value: 'Choose your favorite meme from the Original Trilogy. \n' },
    { name: '/prequelsmemes', value: 'Choose your favorite meme from the Prequels. \n' },
    { name: '/sequelsmemes', value: 'Choose your favorite meme from the Sequels. \n' },
    { name: 'Enjoying Prequels Quote Generator?', value: 'If you are enjoying using this Bot, feel free to vote and leave a review here! \n https://top.gg/bot/591501223174209546' },
    { name: 'Contacts', value: 'If you would like to join the official discord server, Here is the link: https://discord.gg/qkha472nq7 \n Feel free to add me as well if you want to talk about all things Star Wars! Nitsua#0543' }
  )
  .setTimestamp()

const quoteEmbed = new MessageEmbed()
  .setColor('#0099ff')

module.exports = { quoteEmbed, helpEmbed }
