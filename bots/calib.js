const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let calibBot = new Bot(process.env.DISCORD_TOKEN_CALIB, '504284773213011968', 'burger.mp3');
