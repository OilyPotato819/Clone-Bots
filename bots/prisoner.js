const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let prisonerBot = new Bot(process.env.DISCORD_TOKEN_PRISONER, '605882681103745074', 'burger.mp3');
