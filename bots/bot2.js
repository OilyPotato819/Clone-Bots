const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });
const net = require('net');

const clientInfo = net.connect('\\\\.\\pipe\\mypipe');

clientInfo.write('bot2');

clientInfo.on('error', (error) => {
   console.log(error);
});

clientInfo.on('data', () => {
   const client = net.connect('\\\\.\\pipe\\mypipe');
   client.write('bot2, available');
   clients.set('available', client);
   console.log('bot2 making socket');
});

let clients = new Map();

let bot2Bot = new Bot(process.env.DISCORD_TOKEN_BOT2, '', '', '804127173974949949');

function subscribe(userId) {
   let client;

   if (clients.has(userId)) {
      client = clients.get(userId);
   } else {
      client = net.connect('\\\\.\\pipe\\mypipe');
   }

   client.write(`bot2, ${userId}`);
   clients.set(userId, client);

   let audio = bot2Bot.connection.receiver.subscribe(userId);
   audio.pipe(client);
}

bot2Bot.client.once('ready', () => {
   bot2Bot.client.on('voiceStateUpdate', (oldState, newState) => {
      if (!bot2Bot.connection) return;

      const subscriptions = bot2Bot.connection.receiver.subscriptions;

      if (newState.id === bot2Bot.client.user.id) {
         newState.channel.members.forEach((member) => {
            if (member.user.bot && member.id != '987813137988341770') return;

            subscribe(member.user.id);
         });
      } else if (newState.channelId === bot2Bot.voiceId && !newState.member.user.bot) {
         subscribe(newState.member.id);
      } else if (subscriptions.size > 0 && oldState.channelId === bot2Bot.voiceId) {
         subscriptions.delete(newState.member.id);
      }
   });
});
