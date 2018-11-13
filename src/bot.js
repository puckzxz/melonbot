const {
    Client
} = require('discord.js-commando');
const path = require('path');
const chalk = require('chalk');
require('dotenv').config({
    path: path.join(__dirname, '.env')
});

const client = new Client({
    owner: '135554522616561664',
    commandPrefix: '!'
});

client
    .on('error', (err) => {
        console.log(chalk.red(err));
    })
    .on('warn', (wrn) => {
        console.log(chalk.yellow(wrn));
    })
    .on('debug', (dbg) => {
        console.log(chalk.gray(dbg));
    })
    .on('ready', () => {
        console.log(chalk.green(`Client logged in\nLogged in as ${client.user.username}#${client.user.discriminator} - ${client.user.id}`));
        client.user.setActivity('with melons', {
            'type': 'PLAYING'
        });
    })
    .on('disconnect', () => {
        console.log(chalk.yellow('Client disconnected!'));
    })
    .on('reconnecting', () => {
        console.log(chalk.yellow('Client attempting to reconnect...'));
    });

client.registry
    .registerGroup('core', 'Core')
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.TOKEN);