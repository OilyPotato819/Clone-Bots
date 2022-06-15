const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let michaelBot = new Bot(process.env.DISCORD_TOKEN_MICHAEL, '664646572566511653', 'burger.mp3');
