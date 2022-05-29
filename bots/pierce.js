const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let pierceBot = new Bot(process.env.DISCORD_TOKEN_PIERCE, '799416383611863071', 'burger.mp3');
