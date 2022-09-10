const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });
const net = require('net');
const { stdout } = require('process');

let fillerSockets = [];
let sockets = new Map();

const clientInfo = net.connect('\\\\.\\pipe\\mypipe');
clientInfo.write('bot2');

clientInfo.on('error', (error) => {
   console.log(error);
});

let bot2Bot = new Bot(process.env.DISCORD_TOKEN_bot2, '', '', '804127257664028692');

function subscribe(userId) {
   let audio = bot2Bot.connection.receiver.subscribe(userId);
   // audio.pipe(client);

   client.on('data', (opusPacket) => {
      bot2Bot.connection.playOpusPacket(opusPacket);
   });
}

bot2Bot.client.once('ready', () => {
   bot2Bot.client.on('voiceStateUpdate', (oldState, newState) => {
      if (!bot2Bot.connection) return;

      const subscriptions = bot2Bot.connection.receiver.subscriptions;

      if (newState.id === bot2Bot.client.user.id) {
         newState.channel.members.forEach((member) => {
            // if (member.user.bot) return;
            if (member.id === bot2Bot.client.user.id) return;

            subscribe(member.user.id);
         });
      } else if (newState.channelId === bot2Bot.voiceId && !newState.member.user.bot) {
         subscribe(newState.member.id);
      } else if (subscriptions.size > 0 && oldState.channelId === bot2Bot.voiceId) {
         subscriptions.delete(newState.member.id);
         sockets.get(newState.member.id).destroy();
         sockets.delete(newState.member.id);
      }
   });
});
