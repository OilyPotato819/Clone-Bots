const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let augustusBot = new Bot(process.env.DISCORD_TOKEN_AUGUSTUS, '767936474380763146', 'burger.mp3');
