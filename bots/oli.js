const Bot = require('../index');
require('dotenv').config({ path: '../.env' });

let oliBot = new Bot(process.env.DISCORD_TOKEN_OLI, '563161832215281709');
