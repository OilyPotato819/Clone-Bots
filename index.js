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

async function getAvatar(userId) {
   return new Promise((resolve) => {
      client.guilds.cache
         .get('964752875832111104')
         .members.fetch(userId)
         .then((user) => {
            downloadImage(
               user.displayAvatarURL(),
               'D:\\Coding\\GitHub_Repos\\Clone-Bots\\profile_pics'
            ).then(({ filename }) => {
               resolve(filename);
            });
         });
   });
}

client.once('ready', () => {
   console.log(`Logged in as ${client.user.tag}`);

   (async function () {
      const filePath = await getAvatar('270904126974590976');

      client.user.setAvatar(filePath).then(function () {
         fs.unlink(filePath, (err) => {
            if (err) {
               console.error(err);
               return;
            }
         });
      });
   })();
});

client.on('messageCreate', (message) => {
   if (message.author.bot) return;

   console.log(message.guild.members.cache.get('799416383611863071'));
});
