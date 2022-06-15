const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let willcBot = new Bot(process.env.DISCORD_TOKEN_WILLC, '683462652827402282', 'burger.mp3');
