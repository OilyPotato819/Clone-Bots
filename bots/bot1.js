const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });
const net = require('net');
const { stdout } = require('process');
const fs = require('fs');
const { createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const { Writable } = require('stream');

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// let fillerSockets = [];
// let sockets = new Map();

// const clientInfo = net.connect('\\\\.\\pipe\\mypipe');
// clientInfo.write('bot1');

// clientInfo.on('error', (error) => {
//    console.log(error);
// });

// let bot1Bot = new Bot(process.env.DISCORD_TOKEN_BOT1, '', '', '804127173974949949');

// function subscribe(userId) {
//    let audio = bot1Bot.connection.receiver.subscribe(userId);
// }

// bot1Bot.client.once('ready', () => {
//    bot1Bot.client.on('voiceStateUpdate', (oldState, newState) => {
//       if (!bot1Bot.connection) return;

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
//    });
// });

const stream = fs.createWriteStream('pog.mp3');

ffmpeg()
   .input('sounds/metronome.mp3')
   .input('sounds/fnaf.mp3')
   .complexFilter([
      {
         filter: 'amix',
         options: { inputs: 2, duration: 'longest' },
      },
   ])
   .on('end', function () {
      console.log('Finished processing');
   })
   .output(stream)
   .run();
