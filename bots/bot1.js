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

let bot1Bot = new Bot(process.env.DISCORD_TOKEN_BOT1, '', '', '804127173974949949');

function subscribe(userId) {
   let audio = bot1Bot.connection.receiver.subscribe(userId);

   const opusDecoder = new prism.opus.Decoder({
      frameSize: 960,
      channels: 2,
      rate: 48000,
   });

   audio.pipe(opusDecoder);

   opusDecoder.once('data', (chunk) => {
      const stream = fs.createWriteStream('output.txt');
      stream.write(chunk.toString('hex'));

      let data = '';
      for (let word = 0; word < chunk.length / 2; word++) {
         data += chunk[1].toString(16) + chunk[0].toString(16);
         chunk = chunk.slice(2);
      }
      stream.write('\n\n');
      stream.write(data);
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
