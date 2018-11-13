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
            name: 'delete',
            group: 'core',
            memberName: 'delete',
            description: 'Deletes a movie from the Melon Patch Movie Database!',
            examples: ['delete <MOVIE NAME>'],
            guildOnly: true,
            args: [{
                key: 'title',
                prompt: 'What tite would you like to search?',
                type: 'string',
            }]
        });
    }

    async run(msg, args) {
        var message = await msg.say(`Deleting ${args.title} from the database...`);
        deleteMovieByTitle(args.title);
        message.edit(`Deleted **${args.title}** from the database`);
    }
};

function deleteMovieByTitle(movieTitle) {
    MongoClient.connect(mongoURL, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) {
            console.log(chalk.red(err));
        };
        var dbo = db.db(process.env.MONGO_DB);
        dbo.collection(process.env.MONGO_COL).deleteOne({
            'Title': `${movieTitle}`
        }, function (err, obj) {
            if (err) {
                console.log(chalk.red(err));
            }
            console.log(`Deleted ${movieTitle}`);
            db.close();
        });
    });
}