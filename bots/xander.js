const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let xanderBot = new Bot(
   process.env.DISCORD_TOKEN_XANDER,
   '465298168675041300',
   '',
   '983102656304283728'
);
