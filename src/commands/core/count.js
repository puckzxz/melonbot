const {
    Command
} = require('discord.js-commando');
const chalk = require('chalk');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config({
    path: path.join(__dirname, '.env')
});
let mongoURL = process.env.MONGO_URL;

module.exports = class SubmitCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'count',
            group: 'core',
            memberName: 'count',
            description: 'Gets the amount of movies in the database',
            examples: ['count'],
            guildOnly: true,
        });
    }

    async run(msg) {
        var message = await msg.say(`Getting all movies from the database...`);
        getAllInDB(function (result) {
            return message.edit(`There are **${result.length}** movies in the Melon Patch Movie Database!`);
        });
    }
};

function getAllInDB(callback) {
    MongoClient.connect(mongoURL, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) {
            console.log(chalk.red(err));
        };
        var dbo = db.db(process.env.MONGO_DB);
        dbo.collection(process.env.MONGO_COL).find({}).toArray(function (err, result) {
            if (err) {
                console.log(chalk.red(err));
            };
            db.close();
            callback(result);
        });
    });
}