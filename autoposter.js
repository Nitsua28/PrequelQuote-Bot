const { Client, GatewayIntentBits } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');

// Initialize client using updated modern GatewayIntentBits
const client = new Client({ 
    intents: [ 
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages 
    ] 
});

// Use your process environment token securely
client.login("");

// Pass your Top.gg token here inside the quotes
const ap = AutoPoster('', client);

ap.on('posted', () => { 
    console.log('Posted stats to Top.gg!'); 
});
