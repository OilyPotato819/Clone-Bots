const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let tomBot = new Bot(process.env.DISCORD_TOKEN_TOM, '605882681103745074', 'burger.mp3');
