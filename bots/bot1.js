const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });
const net = require('net');

let fillerSockets = [];
let sockets = new Map();

const clientInfo = net.connect('\\\\.\\pipe\\mypipe');
clientInfo.write('bot1');

clientInfo.on('error', (error) => {
   console.log(error);
});

clientInfo.on('data', () => {
   const client = net.connect('\\\\.\\pipe\\mypipe');
   client.write('bot1, filler');
   fillerSockets.push(client);
   console.log('bot1 making socket');

   client.on('end', () => {
      client.destroy();
      fillerSockets.splice(fillerSockets.indexOf(client));

      console.log('destroying socket 1');
   });
});

let bot1Bot = new Bot(process.env.DISCORD_TOKEN_BOT1, '', '', '804127173974949949');

function subscribe(userId) {
   let client = net.connect('\\\\.\\pipe\\mypipe');
   client.write(`bot1, ${userId}`);
   sockets.set(userId, client);

   let audio = bot1Bot.connection.receiver.subscribe(userId);
   audio.pipe(client);
}

bot1Bot.client.once('ready', () => {
   bot1Bot.client.on('voiceStateUpdate', (oldState, newState) => {
      if (!bot1Bot.connection) return;

      const subscriptions = bot1Bot.connection.receiver.subscriptions;

      if (newState.id === bot1Bot.client.user.id) {
         newState.channel.members.forEach((member) => {
            // if (member.user.bot) return;
            if (member.id === bot1Bot.client.user.id) return;

            subscribe(member.user.id);
         });
      } else if (newState.channelId === bot1Bot.voiceId && !newState.member.user.bot) {
         subscribe(newState.member.id);
      } else if (subscriptions.size > 0 && oldState.channelId === bot1Bot.voiceId) {
         subscriptions.delete(newState.member.id);
         sockets.get(newState.member.id).destroy();
         sockets.delete(newState.member.id);
      }
   });
});
