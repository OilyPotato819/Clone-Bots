const { spawn } = require('child_process');
const { Transform } = require('node:stream');

let botsReady = 0;

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

   return bot;
}

const bot1Bot = createBot('bot1');
const bot2Bot = createBot('bot2');
