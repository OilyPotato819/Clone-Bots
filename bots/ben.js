const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let benBot = new Bot(process.env.DISCORD_TOKEN_BEN, '863636854129819668', 'burger.mp3');
