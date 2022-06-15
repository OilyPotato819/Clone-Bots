// const Bot = require('../bot-class');
// require('dotenv').config({ path: '../.env' });

// let oliBot = new Bot(process.env.DISCORD_TOKEN_OLI, '563161832215281709');

// function subscribe(userId) {
//    audio = oliBot.connection.receiver.subscribe(userId);

//    audio.on('data', (opusPacket) => {
//       process.send(opusPacket);
//    });
// }

// process.on('message', (message) => {
//    // console.log(message);
// });

// oliBot.client.once('ready', () => {
//    oliBot.client.on('voiceStateUpdate', (oldState, newState) => {
//       if (!oliBot.connection) return;

//       const subscriptions = oliBot.connection.receiver.subscriptions;

//       if (newState.id === oliBot.client.user.id) {
//          newState.channel.members.forEach((member) => {
//             if (member.user.bot) return;

//             subscribe(member.user.id);
//          });
//       } else if (newState.channelId === oliBot.voiceId && !newState.member.user.bot) {
//          subscribe(newState.member.id);
//       } else if (subscriptions.size > 0 && oldState.channelId === oliBot.voiceId) {
//          subscriptions.delete(newState.member.id);
//       }
//    });
// });
