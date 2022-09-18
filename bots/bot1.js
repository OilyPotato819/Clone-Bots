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

let bot1Bot = new Bot(process.env.DISCORD_TOKEN_BOT1, '', '', '964752876306055169');

function subscribe(userId) {
   let audio = bot1Bot.connection.receiver.subscribe(userId);

   const opusDecoder = new prism.opus.Decoder({
      frameSize: 960,
      channels: 2,
      rate: 48000,
   });

   audio.pipe(opusDecoder);

   const stream = fs.createWriteStream('graph/output.csv');

   opusDecoder.on('data', (chunk) => {
      const wordAmount = Buffer.byteLength(chunk) / 2;

      let chunkIndex = 0;
      for (let word = 0; word < wordAmount; word++, chunkIndex += 2) {
         const hex0 = chunk[0 + chunkIndex].toString(16).padStart(2, '0');
         const hex1 = chunk[1 + chunkIndex].toString(16).padStart(2, '0');

         const hex = `0x${hex1}${hex0}`;
         const amplitude = +hex > 0x7fff ? +hex - 0x10000 : +hex;

         stream.write(amplitude.toString() + ',');

         if (amplitude > 20000) console.log('louder');

         // const byte0 = chunk[0 + chunkIndex];
         // const byte1 = chunk[1 + chunkIndex];
         // stream.write(Buffer.from([byte1, byte0]));
      }
   });
}

bot1Bot.client.once('ready', () => {
   bot1Bot.client.on('voiceStateUpdate', (oldState, newState) => {
      if (!bot1Bot.connection) return;

      subscribe('563161832215281709');

      //       const subscriptions = bot1Bot.connection.receiver.subscriptions;

      //       if (newState.id === bot1Bot.client.user.id) {
      //          newState.channel.members.forEach((member) => {
      //             // if (member.user.bot) return;
      //             if (member.id === bot1Bot.client.user.id) return;

      //             subscribe(member.user.id);
      //          });
      //       } else if (newState.channelId === bot1Bot.voiceId && !newState.member.user.bot) {
      //          subscribe(newState.member.id);
      //       } else if (subscriptions.size > 0 && oldState.channelId === bot1Bot.voiceId) {
      //          subscriptions.delete(newState.member.id);
      //          sockets.get(newState.member.id).destroy();
      //          sockets.delete(newState.member.id);
      //       }
   });
});
