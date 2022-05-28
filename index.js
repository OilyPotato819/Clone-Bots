const Discord = require('discord.js');
const fs = require('fs');
const { joinVoiceChannel } = require('@discordjs/voice');
const { Player } = require('discord-player');
require('dotenv').config();
const download = require('image-downloader');

global.client = new Discord.Client({
   intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MEMBERS'],
});

client.login(process.env.DISCORD_TOKEN);

client.prefix = '!';

function downloadImage(url, filepath) {
   return download.image({
      url,
      dest: filepath,
   });
}

client.once('ready', () => {
   console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
   if (message.author.bot) return;

   downloadImage(message.member.displayAvatarURL(), 'D:\\Coding\\GitHub Repos\\Clone-Bots');
});
