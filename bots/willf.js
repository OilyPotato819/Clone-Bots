const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let willfBot = new Bot(process.env.DISCORD_TOKEN_WILLF, '450112554333896704', 'burger.mp3');
