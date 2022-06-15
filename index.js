const { spawn } = require('child_process');
const fs = require('fs');

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

   bot.stdout.on('data', (data) => {
      if (data.toString() === 'ready') {
         console.log(`${name}: ` + data.toString());

         botsReady++;

         if (botsReady >= 2) setPipes();
      } else if (/^[\u0000-\u007f]*$/.test(data.toString())) {
         console.log(data.toString());
      }
   });

   bot.stderr.on('data', (data) => {
      console.log(data.toString());
   });

   return bot;
}

const bot1Bot = createBot('bot1');
const bot2Bot = createBot('bot2');

function setPipes() {
   bot1Bot.stdout.pipe(bot2Bot.stdin);
   bot2Bot.stdout.pipe(bot1Bot.stdin);
}
