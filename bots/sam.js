const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let samBot = new Bot(process.env.DISCORD_TOKEN_SAM, '797804878029520896', 'burger.mp3');
