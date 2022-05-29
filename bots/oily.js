const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let oilyBot = new Bot(process.env.DISCORD_TOKEN_OILY, '563161832215281709', 'burger.mp3');
