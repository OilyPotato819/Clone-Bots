const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let simonBot = new Bot(process.env.DISCORD_TOKEN_SIMON, '512415667115524106', 'burger.mp3');
