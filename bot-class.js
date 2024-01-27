const Discord = require('discord.js');
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
require('dotenv').config();

module.exports = class Bot {
  constructor(token, parentUserId, soundName, voiceId) {
    this.token = token;
    this.parentUserId = parentUserId || '563161832215281709';
    this.soundName = soundName;

    this.client = new Discord.Client({
      intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MEMBERS'],
    });

    this.client.login(this.token);

    this.client.once('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}`);

      this.client.guilds.cache.each((value) => {
        value.members.fetch().then((members) => {
          const member = members.get('563161832215281709');

          if (member.voice.channel) {
            this.voiceId = member.voice.channelId;
            this.guildId = member.guild.id;

            if (voiceId) {
              this.voiceId = voiceId;
            }

            this.joinVoice();

            return false;
          } else {
            return true;
          }
        });
      });
    });
  }

  joinVoice() {
    this.connection = joinVoiceChannel({
      channelId: this.voiceId,
      guildId: this.guildId,
      adapterCreator: this.client.guilds.cache.get(this.guildId).voiceAdapterCreator,
      selfDeaf: false,
    });

    this.changeAvatar();

    this.player = createAudioPlayer();

    if (!this.soundName) return;

    const soundPath = `sounds/${this.soundName}`;

    fs.access(soundPath, fs.F_OK, (err) => {
      if (err) {
        return console.error('error: sound not found for ' + this.client.user.tag);
      }

      this.player.resource = createAudioResource(soundPath);

      this.player.play(this.player.resource);

      this.connection.subscribe(this.player);
    });
  }

  changeAvatar() {
    const guild = this.client.guilds.cache.get(this.guildId);
    guild.members
      .fetch(this.parentUserId)
      .then(
        (user) => {
          this.avatar = user.displayAvatarURL();
        },
        () => {
          guild.members.fetch('563161832215281709').then((user) => {
            this.avatar = user.displayAvatarURL();
          });
        }
      )
      .then(() => {
        this.client.user.setAvatar(this.avatar).catch((error) => {
          if (error.code === 50035) {
            console.log(`${this.client.user.tag} is changing their avatar too fast. Try again later.`);
          } else {
            console.error('error: ' + error.code);
          }
        });
      });
  }
};
