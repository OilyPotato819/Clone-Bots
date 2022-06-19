const { spawn } = require('child_process');
const net = require('net');

let sockets = { bot1: new Map(), bot2: new Map() };

let info = {};

let server = net.createServer((socket) => {
   if (!info.bot1 || !info.bot2) {
      socket.once('data', (data) => {
         info[data.toString()] = socket;
      });

      if (info.bot1 && info.bot2) {
         info.bot1.write('request socket');
      }

      return;
   }

   socket.once('data', (data) => {
      const dataArray = data.toString().split(', ');

      sockets[dataArray[0]].set(dataArray[1], socket);

      const otherBot = Object.keys(sockets).find((element) => element != dataArray[0]);

      // console.log(sockets[otherBot].get('none'));
   });
});

server.listen('\\\\.\\pipe\\mypipe');

function createBot(name) {
   const bot = spawn('node', [`bots/${name}`]);

   bot.once('spawn', () => {
      console.log(`${name} has been spawned`);
   });

   bot.on('error', (error) => {
      console.log(`${name}: ${error}`);
   });

   bot.on('close', (code) => {
      console.log(`${name} exited with code ${code}`);
   });

   bot.stderr.on('data', (data) => {
      console.log(data.toString());
   });

   bot.stdout.on('data', (data) => {
      console.log(data.toString());
   });

   return bot;
}

const bot1Bot = createBot('bot1');
const bot2Bot = createBot('bot2');
// const bot3Bot = spawn('node', ['bots/bot3']);
