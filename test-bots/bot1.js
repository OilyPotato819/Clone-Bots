// const WalkieTalkie = require('../bot-class.js');

// new WalkieTalkie(process.env.BOT1_ID, '1120179354832482314');

const Discord = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();
let { OpusEncoder } = require('@discordjs/opus');

class Bot {
  constructor(token, voiceId) {
    this.token = token;
    this.voiceId = voiceId;

    this.client = new Discord.Client({
      intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MEMBERS'],
    });

    this.client.login(this.token);

    this.client.once('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}`);
      this.id = this.client.user.id;
      this.displayName = this.client.user.displayName;
      this.ready();
    });
  }

  joinVoice(guildId, voiceId) {
    this.connection = joinVoiceChannel({
      channelId: voiceId,
      guildId: guildId,
      adapterCreator: this.client.guilds.cache.get(guildId).voiceAdapterCreator,
      selfDeaf: false,
    });
  }
}

const guildId = '785682503968096276';
const bot1 = new Bot(process.env.BOT1_ID, '804127458608676885');
bot1.ready = function () {
  this.joinVoice(guildId, this.voiceId);

  const stream = this.connection.receiver.subscribe('963636924646576128');
  stream.on('data', (chunk) => {
    this.connection.playOpusPacket(chunk);
  });
};
