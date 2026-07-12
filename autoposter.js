const { Client, Intents } = require('discord.js')
const { AutoPoster } = require('topgg-autoposter')
const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS
  ]
})
client.login('')// process.env.DISCORD_BOT_TOKEN);

const ap = AutoPoster('', client)

ap.on('posted', () => {
  console.log('Posted stats to Top.gg!')
})
