const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let xanderBot = new Bot(process.env.DISCORD_TOKEN_XANDER, '465298168675041300', 'burger.mp3');
