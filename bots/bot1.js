const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let bot1Bot = new Bot(process.env.DISCORD_TOKEN_BOT1, '', '', '');

function subscribe(userId) {
   let audio = bot1Bot.connection.receiver.subscribe(userId);
}

bot1Bot.client.once('ready', () => {
   bot1Bot.client.on('voiceStateUpdate', (oldState, newState) => {
      if (!bot1Bot.connection) return;

      const subscriptions = bot1Bot.connection.receiver.subscriptions;

      if (newState.id === bot1Bot.client.user.id) {
         newState.channel.members.forEach((member) => {
            if (member.user.bot) return;

            subscribe(member.user.id);
         });
      } else if (newState.channelId === bot1Bot.voiceId && !newState.member.user.bot) {
         subscribe(newState.member.id);
      } else if (subscriptions.size > 0 && oldState.channelId === bot1Bot.voiceId) {
         subscriptions.delete(newState.member.id);
      }
   });
});
