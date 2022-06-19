const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });
const net = require('net');

const clientInfo = net.connect('\\\\.\\pipe\\mypipe');

clientInfo.write('bot1');

clientInfo.on('error', (error) => {
   console.log(error);
});

clientInfo.on('data', () => {
   const client = net.connect('\\\\.\\pipe\\mypipe');
   client.write('bot1, none');
   clients.set('none', client);
   console.log('creating socket');
});

let clients = new Map();

let bot1Bot = new Bot(process.env.DISCORD_TOKEN_BOT1, '', '', '804127257664028692');

function subscribe(userId, client) {
   client.write(`bot1, ${userId}`);
   clients.set(userId, client);

   let audio = bot1Bot.connection.receiver.subscribe(userId);
   audio.pipe(client);
}

bot1Bot.client.once('ready', () => {
   bot1Bot.client.on('voiceStateUpdate', (oldState, newState) => {
      if (!bot1Bot.connection) return;

      const subscriptions = bot1Bot.connection.receiver.subscriptions;

      if (newState.id === bot1Bot.client.user.id) {
         newState.channel.members.forEach((member) => {
            if (member.user.bot) return;

            subscribe(member.user.id, net.connect('\\\\.\\pipe\\mypipe'));
         });
      } else if (newState.channelId === bot1Bot.voiceId && !newState.member.user.bot) {
         subscribe(newState.member.id);
      } else if (subscriptions.size > 0 && oldState.channelId === bot1Bot.voiceId) {
         subscriptions.delete(newState.member.id);
      }
   });
});
