const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let willCBot = new Bot(process.env.DISCORD_TOKEN_WILLC, '683462652827402282', 'burger.mp3');
