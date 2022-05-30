const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let kalibBot = new Bot(process.env.DISCORD_TOKEN_KALIB, '691344862871552041', 'burger.mp3');
