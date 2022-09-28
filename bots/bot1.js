const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const { createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const prism = require('prism-media');

// let fillerSockets = [];
// let sockets = new Map();

// const clientInfo = net.connect('\\\\.\\pipe\\mypipe');
// clientInfo.write('bot1');

// clientInfo.on('error', (error) => {
//    console.log(error);
// });

const targetId = '605882681103745074';
let bot1Bot = new Bot(process.env.DISCORD_TOKEN_BOT1, '', '', '804127173974949949');

function subscribe(userId, guildId) {
   let audio = bot1Bot.connection.receiver.subscribe(userId);

   const opusDecoder = new prism.opus.Decoder({
      frameSize: 960,
      channels: 2,
      rate: 48000,
   });

   audio.pipe(opusDecoder).pipe(fs.createWriteStream('graph/audio-output.bin'));

   const stream = fs.createWriteStream('graph/output.csv');

   opusDecoder.on('data', (chunk) => {
      const wordAmount = Buffer.byteLength(chunk) / 2;

      let chunkIndex = 0;
      for (let word = 0; word < wordAmount; word++, chunkIndex += 2) {
         const hex0 = chunk[0 + chunkIndex].toString(16).padStart(2, '0');
         const hex1 = chunk[1 + chunkIndex].toString(16).padStart(2, '0');

         const hex = `0x${hex1}${hex0}`;
         const amplitude = +hex > 0x7fff ? +hex - 0x10000 : +hex;

         // stream.write(amplitude.toString() + ',');

         // console.log(amplitude);

         const limit = 20000;
         if (amplitude > limit || amplitude < -limit) {
            opusDecoder.destroy();
            const guild = bot1Bot.client.guilds.cache.get(guildId);
            return guild.members.cache.get(userId).voice.disconnect();
         }
      }
   });
}

bot1Bot.client.once('ready', () => {
   bot1Bot.client.on('voiceStateUpdate', (oldState, newState) => {
      if (!bot1Bot.connection) return;

      const subscriptions = bot1Bot.connection.receiver.subscriptions;

      if (newState.id === bot1Bot.client.user.id) {
         subscribe(targetId, newState.guild.id);
         //    newState.channel.members.forEach((member) => {
         //       // if (member.user.bot) return;
         //       if (member.id === bot1Bot.client.user.id) return;

         //       subscribe(member.user.id, newState.guild.id);
         //    });
      } else if (
         newState.channelId === bot1Bot.voiceId &&
         !newState.member.user.bot &&
         newState.member.user.id == targetId
      ) {
         subscribe(newState.member.id, newState.guild.id);
      } else if (
         subscriptions.size > 0 &&
         oldState.channelId === bot1Bot.voiceId &&
         newState.channelId != bot1Bot.voiceId
      ) {
         subscriptions.get(newState.member.id).destroy();
         // console.log(newState.member.id, newState.channelId);
         // sockets.get(newState.member.id).destroy();
         // sockets.delete(newState.member.id);
      }
   });
});
