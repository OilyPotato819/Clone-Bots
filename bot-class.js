const Discord = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();
let { OpusEncoder } = require('@discordjs/opus');

const guildId = '785682503968096276';
const brawlerId = '963636924646576128';
const matchboxId = '1145363441524166758';

class Bot {
  constructor(token, voiceId) {
    this.token = token;
    this.voiceId = voiceId;

    this.client = new Discord.Client({
      intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MEMBERS'],
    });

    this.client.login(this.token);

    this.client.once('ready', () => {
      process.send(`Logged in as ${this.client.user.tag}`);
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

class WalkieTalkie extends Bot {
  constructor(token, voiceId) {
    super(token, voiceId);

    this.buffer = Buffer.alloc(3840);
    this.wroteToBuffer = [];

    this.encoder = new OpusEncoder(48000, 2);

    this.sendNum = 0;
    this.sendInterval = setInterval(() => {
      if (this.sendNum === 0 && this.client.user.displayName === 'Bot1') {
        process.send(`${this.client.user.displayName}: send`);
      }
      this.sendNum = 0;
    }, 1000);

    this.getNum = 0;
    this.getInterval = setInterval(() => {
      if (this.getNum === 0 && this.client.user.displayName === 'Bot2') {
        process.send(`${this.client.user.displayName}: get`);
      }
      this.getNum = 0;
    }, 1000);

    process.stdin.on('data', (data) => {
      this.play(data);
    });
  }

  ready() {
    this.joinVoice(guildId, this.voiceId);

    const voiceChannel = this.client.channels.cache.get(this.voiceId);
    for (const member of voiceChannel.members) {
      const id = member[0];
      if (id === this.id) continue;
      this.subscribe(id);
    }

    this.client.on('voiceStateUpdate', (oldState, newState) => {
      if (newState.channelId === this.voiceId && newState.id != this.id) {
        this.subscribe(newState.id);
      } else if (oldState.channelId === this.voiceId && newState.channelId != this.voiceId) {
        this.unsubscribe(newState.id);
      }
    });
  }

  subscribe(userId) {
    if (this.displayName === 'Bot2') return;
    const stream = this.connection.receiver.subscribe(userId);
    const encoder = new OpusEncoder(48000, 2);

    stream.on('data', (chunk) => {
      this.addBytes(userId, encoder.decode(chunk), userId === brawlerId ? 0.1 : 0.1);
    });

    this.stream = stream;
  }

  unsubscribe(userId) {
    let subscriptions = this.connection.receiver.subscriptions;
    subscriptions.get(userId).destroy();
    subscriptions.delete(userId);
  }

  addBytes(id, decodedBuffer, volume) {
    if (this.wroteToBuffer.includes(id)) {
      this.wroteToBuffer = [];
      this.sendNum++;
      process.stdout.write(this.buffer);
      this.buffer = Buffer.alloc(this.buffer.length);
    }

    for (let i = 0; i < this.buffer.length; i += 2) {
      const word1 = this.buffer.readInt16LE(i);
      const word2 = decodedBuffer.readInt16LE(i);
      const clampedSum = Math.min(Math.max(word1 + word2 * volume, -32768), 32767);
      this.buffer.writeInt16LE(clampedSum, i);
    }

    this.wroteToBuffer.push(id);
  }

  play(buffer) {
    this.getNum++;
    this.connection.playOpusPacket(this.encoder.encode(buffer));
  }
}

// class Bot {
//   constructor(token, parentUserId, soundName, voiceId) {
//     this.token = token;
//     this.parentUserId = parentUserId || '563161832215281709';
//     this.soundName = soundName;

//     this.client = new Discord.Client({
//       intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MEMBERS'],
//     });

//     this.client.login(this.token);

//     this.client.once('ready', () => {
//       console.log(`Logged in as ${this.client.user.tag}`);

//       this.client.guilds.cache.each((value) => {
//         value.members.fetch().then((members) => {
//           const member = members.get('563161832215281709');

//           if (member.voice.channel) {
//             this.voiceId = member.voice.channelId;
//             this.guildId = member.guild.id;

//             if (voiceId) {
//               this.voiceId = voiceId;
//             }

//             this.joinVoice();

//             return false;
//           } else {
//             return true;
//           }
//         });
//       });
//     });
//   }

//   joinVoice() {
//     this.connection = joinVoiceChannel({
//       channelId: this.voiceId,
//       guildId: this.guildId,
//       adapterCreator: this.client.guilds.cache.get(this.guildId).voiceAdapterCreator,
//       selfDeaf: false,
//     });

//     this.changeAvatar();

//     this.player = createAudioPlayer();

//     if (!this.soundName) return;

//     const soundPath = `sounds/${this.soundName}`;

//     fs.access(soundPath, fs.F_OK, (err) => {
//       if (err) {
//         return console.error('error: sound not found for ' + this.client.user.tag);
//       }

//       this.player.resource = createAudioResource(soundPath);

//       this.player.play(this.player.resource);

//       this.connection.subscribe(this.player);
//     });
//   }

//   changeAvatar() {
//     const guild = this.client.guilds.cache.get(this.guildId);
//     guild.members
//       .fetch(this.parentUserId)
//       .then(
//         (user) => {
//           this.avatar = user.displayAvatarURL();
//         },
//         () => {
//           guild.members.fetch('563161832215281709').then((user) => {
//             this.avatar = user.displayAvatarURL();
//           });
//         }
//       )
//       .then(() => {
//         this.client.user.setAvatar(this.avatar).catch((error) => {
//           if (error.code === 50035) {
//             console.log(`${this.client.user.tag} is changing their avatar too fast. Try again later.`);
//           } else {
//             console.error('error: ' + error.code);
//           }
//         });
//       });
//   }
// }

module.exports = WalkieTalkie;
