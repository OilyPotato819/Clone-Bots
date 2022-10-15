const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const { createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const prism = require('prism-media');
const express = require('express');
const app = express();
let data = {};

app.get('/', (req, res) => {
   res.sendFile('D:/Coding/GitHub_Repos/Clone-Bots/graph/graph.html');
});

app.get('/graph.js', function (req, res) {
   res.sendFile('D:/Coding/GitHub_Repos/Clone-Bots/graph/graph.js');
});

app.get('/getData', (req, res) => {
   res.send(data);
});

app.listen(3000, () => {
   console.log('App listening on port 3000');
});

// let fillerSockets = [];
// let sockets = new Map();

// const clientInfo = net.connect('\\\\.\\pipe\\mypipe');
// clientInfo.write('bot1');

// clientInfo.on('error', (error) => {
//    console.log(error);
// });

// const targetId = '563161832215281709';
// let bot1Bot = new Bot(process.env.DISCORD_TOKEN_BOT1, '', '', '964752876306055169');

// function subscribe(userId, guildId) {
//    let audio = bot1Bot.connection.receiver.subscribe(userId);
// }

// bot1Bot.client.once('ready', () => {
//    bot1Bot.client.on('voiceStateUpdate', (oldState, newState) => {
//       if (!bot1Bot.connection) return;

//       const subscriptions = bot1Bot.connection.receiver.subscriptions;

//       if (newState.id === bot1Bot.client.user.id) {
//          subscribe(targetId, newState.guild.id);
//          //    newState.channel.members.forEach((member) => {
//          //       // if (member.user.bot) return;
//          //       if (member.id === bot1Bot.client.user.id) return;

//          //       subscribe(member.user.id, newState.guild.id);
//          //    });
//       } else if (
//          newState.channelId === bot1Bot.voiceId &&
//          !newState.member.user.bot &&
//          newState.member.user.id == targetId
//       ) {
//          subscribe(newState.member.id, newState.guild.id);
//       } else if (
//          subscriptions.size > 0 &&
//          oldState.channelId === bot1Bot.voiceId &&
//          newState.channelId != bot1Bot.voiceId
//       ) {
//          subscriptions.get(newState.member.id).destroy();
//          // console.log(newState.member.id, newState.channelId);
//          // sockets.get(newState.member.id).destroy();
//          // sockets.delete(newState.member.id);
//       }
//    });
// });
