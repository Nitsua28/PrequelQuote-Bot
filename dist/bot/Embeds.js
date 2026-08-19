const { EmbedBuilder, AttachmentBuilder } = require('discord.js')

const voteImg = new AttachmentBuilder('ifindyourlackofvotesdisturbing.jpg', { name: 'votes.jpg'});

const helpEmbed = new EmbedBuilder()
  .setColor('#0099ff')
  .setTitle('Star Wars Quote Generator - Commands')
  .setDescription('Welcome to Star Wars Quote Generator!')
  .setThumbnail('https://cdn.discordapp.com/app-icons/591501223174209546/2d2e82027601f7ccd4005e07093e2f96.png?size=256')
  .addFields(
    { name: '/setautopostchannel', value: 'set a channel in your server to auto post a channel everyday at noon! (must have admin/mod privileges, and must be a text channel)\n' },
    { name: '/searchquote', value: 'Search for your favorite quote from Star Wars!.\n' },
    { name: '/random', value: 'Generates a random quote from Star Wars! You can sort by Character, Movie, Trilogy or preDisney option.\n' },
    { name: '/help', value: 'Shows list of commands.\n' },
    { name: '/originaltrilogymemes', value: 'Choose your favorite meme from the Original Trilogy. \n' },
    { name: '/prequelsmemes', value: 'Choose your favorite meme from the Prequels. \n' },
    { name: '/sequelsmemes', value: 'Choose your favorite meme from the Sequels. \n' },
    { name: 'Enjoying Star Wars Quote Generator?', value: 'If you are enjoying using this Bot, feel free to vote and leave a review here! \n https://top.gg/bot/591501223174209546' },
    { name: 'Contacts', value: 'If you would like to join the official discord server, Here is the link: https://discord.gg/RgqXV27aw2 \n' }
  )
  .setTimestamp()

const voteEmbed = new EmbedBuilder()
  .setColor('#ff0000')
  .setTitle('Weekend Vote Restriction')
  .setDescription('Vote here to unlock access to /searchquote \n https://top.gg/bot/591501223174209546')
  .setThumbnail('https://cdn.discordapp.com/app-icons/591501223174209546/2d2e82027601f7ccd4005e07093e2f96.png?size=256')
  .setImage('attachment://votes.jpg')
  .setTimestamp()

const quoteEmbed = new EmbedBuilder()
  .setColor('#0099ff')

module.exports = { quoteEmbed, helpEmbed, voteEmbed, voteImg }
