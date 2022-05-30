const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let lavardBot = new Bot(process.env.DISCORD_TOKEN_LAVARD, '664646572566511653', 'burger.mp3');
