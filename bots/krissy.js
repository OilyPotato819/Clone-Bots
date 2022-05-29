const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let krissyBot = new Bot(process.env.DISCORD_TOKEN_KRISSY, '267780061988388865', 'burger.mp3');
