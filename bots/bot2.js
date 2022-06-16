const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let bot2Bot = new Bot(process.env.DISCORD_TOKEN_BOT2, '', '', '804127173974949949');

function subscribe(userId) {
   let audio = bot2Bot.connection.receiver.subscribe(userId);
}

bot2Bot.client.once('ready', () => {
   bot2Bot.client.on('voiceStateUpdate', (oldState, newState) => {
      if (!bot2Bot.connection) return;

      const subscriptions = bot2Bot.connection.receiver.subscriptions;

      if (newState.id === bot2Bot.client.user.id) {
         console.log(newState.channel);
         newState.channel.members.forEach((member) => {
            if (member.user.bot) return;

            subscribe(member.user.id);
         });
      } else if (newState.channelId === bot2Bot.voiceId && !newState.member.user.bot) {
         subscribe(newState.member.id);
      } else if (subscriptions.size > 0 && oldState.channelId === bot2Bot.voiceId) {
         subscriptions.delete(newState.member.id);
      }
   });
});
