const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let krissyBot = new Bot(process.env.DISCORD_TOKEN_KRISSY, '267780061988388865', 'burger.mp3');
