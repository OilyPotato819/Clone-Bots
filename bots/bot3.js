const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let bot3Bot = new Bot(process.env.DISCORD_TOKEN_BOT3, '', 'burger.mp3', '804127173974949949');
