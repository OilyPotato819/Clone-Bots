const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let pierceBot = new Bot(process.env.DISCORD_TOKEN_PIERCE, '799416383611863071', 'burger.mp3');
