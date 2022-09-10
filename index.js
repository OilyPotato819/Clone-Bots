const { spawn } = require('child_process');
const net = require('net');
const { stdout } = require('process');

let sockets = { bot1: { map: new Map(), filler: [] }, bot2: { map: new Map(), filler: [] } };
let info = {};
let requests = [];

let server = net.createServer((socket) => {
   if (!info.bot1 || !info.bot2) {
      socket.once('data', (data) => {
         info[data.toString()] = socket;
      });

      return;
   }

   socket.on('close', () => {
      for (const bot in sockets) {
         if (sockets[bot].map.get(socket.id)) {
            sockets[bot].map.delete(socket.id);
            return;
         }
      }
      socket.emit('end');
   });

   socket.once('data', (data) => {
      const dataArray = data.toString().split(', ');
      const bot = dataArray[0];
      const id = dataArray[1];

      let mapValue;

      if (id === 'filler') {
         mapValue = sockets[bot].filler.push(socket);
      } else {
         mapValue = sockets[bot].map.set(id, socket);
      }

      socket.id = id;

      const otherBot = Object.keys(sockets).find((element) => element != bot);

      for (let [key, value] of sockets[otherBot].map.entries()) {
         if (value.pipedToId === 'none') {
            value.pipedToId = id;
            socket.pipedToId = key;
            value.pipe(socket);
            socket.pipe(value);
            return;
         }
      }
      socket.pipedToId = 'none';

      if (info[otherBot].writing) {
         requests.push(id);

         info[otherBot].on(id, () => {
            requestSocket();
         });
      } else {
         requests.push(id);
         requestSocket();
      }

      function requestSocket() {
         info[otherBot].writing = true;

         info[otherBot].write('socket request', () => {
            requests.splice(0, 1);
            info[otherBot].emit(requests[0]);
            info[otherBot].writing = false;
         });
      }
   });
});

setTimeout(() => {
   for (const bot in sockets) {
      // sockets[bot].map.forEach((element) => console.log(element.pipedToId));
      // sockets[bot].filler.forEach((element) => console.log(element.pipedToId));
      // console.log(sockets);
   }
}, 5000);

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
