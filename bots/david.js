const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let davidBot = new Bot(process.env.DISCORD_TOKEN_DAVID, '767936474380763146', 'burger.mp3');
