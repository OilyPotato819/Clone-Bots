const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let jamesPBot = new Bot(process.env.DISCORD_TOKEN_JAMESP, '336660270396997643', 'burger.mp3');
