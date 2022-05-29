const Discord = require('discord.js');
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
require('dotenv').config();
const download = require('image-downloader');
const path = require('path');

const guildId = '964752875832111104';
const vcId = '964752876306055169';

function downloadImage(url, filepath) {
   return download.image({
      url,
      dest: filepath,
   });
}

async function getAvatar(client, originalId) {
   return new Promise((resolve) => {
      const guild = client.guilds.cache.get(guildId);

      guild.members.fetch(originalId).then(
         (user) => {
            download(user);
         },
         () => {
            guild.members.fetch('563161832215281709').then((user) => {
               download(user);
            });
         }
      );

      function download(user) {
         downloadImage(user.displayAvatarURL(), '../../profile_pics').then(({ filename }) => {
            resolve(filename);
         });
      }
   });
}

async function changeAvatar(client, originalId) {
   const filePath = await getAvatar(client, originalId);

   client.user
      .setAvatar(filePath)
      .catch((error) => {
         if (error.code === 50035) {
            console.log(`${client.user.tag} is changing their avatar too fast. Try again later.`);
         } else {
            console.log(error);
         }

         return;
      })
      .then(function () {
         fs.unlink(filePath, (err) => {
            if (err) return console.error(err);
         });
      });
}

module.exports = class Bot {
   constructor(token, originalId, soundName) {
      this.token = token;
      this.originalId = originalId;
      this.soundName = soundName;

      this.client = new Discord.Client({
         intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MEMBERS'],
      });

      this.client.login(this.token);

      this.client.once('ready', () => {
         console.log(`Logged in as ${this.client.user.tag}`);

         this.run();
      });
   }

   run() {
      changeAvatar(this.client, this.originalId);

      const guild = this.client.guilds.cache.get(guildId);

      this.connection = joinVoiceChannel({
         channelId: vcId,
         guildId: guildId,
         adapterCreator: guild.voiceAdapterCreator,
         selfDeaf: false,
      });

      this.player = createAudioPlayer();

      if (!this.soundName) return;

      const soundPath = `../sounds/${this.soundName}`;

      fs.access(soundPath, fs.F_OK, (err) => {
         if (err) {
            return console.error(this.client.user.tag, 'sound not found');
         }

         this.player.resource = createAudioResource(soundPath);

         this.player.play(this.player.resource);

         this.connection.subscribe(this.player);
      });
   }
};
