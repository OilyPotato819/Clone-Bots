const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let jamespBot = new Bot(process.env.DISCORD_TOKEN_JAMESP, '336660270396997643', 'burger.mp3');
