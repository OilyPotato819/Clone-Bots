const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let willFBot = new Bot(process.env.DISCORD_TOKEN_WILLF, '450112554333896704', 'burger.mp3');
