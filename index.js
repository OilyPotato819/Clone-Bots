// const { spawn } = require('child_process');
// const net = require('net');
// const { stdout } = require('process');

// let sockets = { bot1: { map: new Map(), filler: [] }, bot2: { map: new Map(), filler: [] } };
// let info = {};
// let requests = [];

// let server = net.createServer((socket) => {
//    if (!info.bot1 || !info.bot2) {
//       socket.once('data', (data) => {
//          info[data.toString()] = socket;
//       });

//       return;
//    }

//    socket.on('close', () => {
//       for (const bot in sockets) {
//          if (sockets[bot].map.get(socket.id)) {
//             sockets[bot].map.delete(socket.id);
//             return;
//          }
//       }
//       socket.emit('end');
//    });

//    socket.once('data', (data) => {
//       const dataArray = data.toString().split(', ');
//       const bot = dataArray[0];
//       const id = dataArray[1];

//       let mapValue;

//       if (id === 'filler') {
//          mapValue = sockets[bot].filler.push(socket);
//       } else {
//          mapValue = sockets[bot].map.set(id, socket);
//       }

//       socket.id = id;

//       const otherBot = Object.keys(sockets).find((element) => element != bot);

//       for (let [key, value] of sockets[otherBot].map.entries()) {
//          if (value.pipedToId === 'none') {
//             value.pipedToId = id;
//             socket.pipedToId = key;
//             value.pipe(socket);
//             socket.pipe(value);
//             return;
//          }
//       }
//       socket.pipedToId = 'none';

//       if (info[otherBot].writing) {
//          requests.push(id);

//          info[otherBot].on(id, () => {
//             requestSocket();
//          });
//       } else {
//          requests.push(id);
//          requestSocket();
//       }

//       function requestSocket() {
//          info[otherBot].writing = true;

//          info[otherBot].write('socket request', () => {
//             requests.splice(0, 1);
//             info[otherBot].emit(requests[0]);
//             info[otherBot].writing = false;
//          });
//       }
//    });
// });

// setTimeout(() => {
//    for (const bot in sockets) {
//       // sockets[bot].map.forEach((element) => console.log(element.pipedToId));
//       // sockets[bot].filler.forEach((element) => console.log(element.pipedToId));
//       // console.log(sockets);
//    }
// }, 5000);

// server.listen('\\\\.\\pipe\\mypipe');

// function createBot(name) {
//    const bot = spawn('node', [`bots/${name}`]);

//    bot.once('spawn', () => {
//       console.log(`${name} has been spawned`);
//    });

//    bot.on('error', (error) => {
//       console.log(`${name}: ${error}`);
//    });

//    bot.on('close', (code) => {
//       console.log(`${name} exited with code ${code}`);
//    });

//    bot.stderr.on('data', (data) => {
//       console.log(data.toString());
//    });

//    bot.stdout.on('data', (data) => {
//       console.log(data.toString());
//    });

//    return bot;
// }

// const bot1Bot = createBot('bot1');
// const bot2Bot = createBot('bot2');
// const bot3Bot = spawn('node', ['bots/bot3']);

const Discord = require('discord.js');
const fs = require('fs');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();

let { OpusEncoder } = require('@discordjs/opus');

const writeStream = fs.createWriteStream('output.pcm');

class Bot {
  constructor(token, voiceId) {
    this.token = token;

    this.voiceId = voiceId;
    this.guildId = '785682503968096276';

    this.client = new Discord.Client({
      intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MEMBERS'],
    });

    this.client.login(this.token);

    this.client.once('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}`);
      this.joinVoice();
    });

    this.buffer = Buffer.alloc(3840);
    this.wroteToBuffer = [];
    this.encoder = new OpusEncoder(48000, 2);
  }

  joinVoice() {
    this.connection = joinVoiceChannel({
      channelId: this.voiceId,
      guildId: this.guildId,
      adapterCreator: this.client.guilds.cache.get(this.guildId).voiceAdapterCreator,
      selfDeaf: false,
    });

    this.subscribe('963636924646576128');
    this.subscribe('184405311681986560');
  }

  subscribe(userId) {
    const stream = this.connection.receiver.subscribe(userId);
    const encoder = new OpusEncoder(48000, 2);

    stream.on('data', (chunk) => {
      this.addBytes(userId, encoder.decode(chunk));
    });
  }

  addBytes(id, decodedBuffer) {
    if (this.wroteToBuffer.includes(id)) {
      this.wroteToBuffer = [];
      this.connection.playOpusPacket(this.encoder.encode(this.buffer));
      this.buffer = Buffer.alloc(this.buffer.length);
    }

    for (let i = 0; i < this.buffer.length; i += 2) {
      const word1 = this.buffer.readInt16LE(i);
      const word2 = decodedBuffer.readInt16LE(i);
      const clampedSum = Math.min(Math.max(word1 + word2, -32768), 32767);
      this.buffer.writeInt16LE(clampedSum, i);
    }

    this.wroteToBuffer.push(id);
  }
}

new Bot(process.env.BOT1_ID, '982842955096285215');
