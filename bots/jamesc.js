const Bot = require('../bot-class');
require('dotenv').config({ path: '../.env' });

let jamescBot = new Bot(process.env.DISCORD_TOKEN_JAMESC, '858120445794582558', 'burger.mp3');
