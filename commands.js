const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN)

rest.get(Routes.applicationCommands(process.env.DISCORD_BOT_CLIENTID))
  .then(() => console.log())
  .catch(console.error)
