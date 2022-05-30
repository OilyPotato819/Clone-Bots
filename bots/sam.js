const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let samBot = new Bot(process.env.DISCORD_TOKEN_SAM, '797804878029520896', 'burger.mp3');
