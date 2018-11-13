const {
    Command
} = require('discord.js-commando');
const path = require('path');
const {
    XMLHttpRequest
} = require('xmlhttprequest');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config({
    path: path.join(__dirname, '.env')
});
let mongoURL = process.env.MONGO_URL;
let xmlHttp = new XMLHttpRequest();

module.exports = class PollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'poll',
            group: 'core',
            memberName: 'poll',
            description: 'Creates a strawpoll based on the genre and amount of movies ',
            examples: ['poll <GENRE> <MOVIE AMOUNT>'],
            guildOnly: true,
            args: [{
                    key: 'genre',
                    prompt: 'What movie genre would you like? Ex. Sci-Fi',
                    type: 'string'
                },
                {
                    key: 'count',
                    prompt: 'How many movies will be in the poll? 2-10',
                    type: 'string',
                    validate: count => {
                        if (count >= 2 && count < 20) {
                            return true;
                        } else {
                            return 'The count parameter must be at least 2!';
                        }
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        var message = await msg.say("Creating poll...");
        getMovieFromDB(args.genre, function (result) {
            let movieTitles = [];
            if (result.length < 2) {
                return message.edit(`There are not enough movies with the **${args.genre}** tag!\nThere must be **at least** 2 movies!\nThere may not be enough movies that fit that genre or you might of misspelled the genre!`);
            }
            if (result.length < args.count) {
                msg.say(`There are not **${args.count}** movies with the **${args.genre}** tag!  I will try my best with the movies I have!`);
                args.count = result.length;
            }
            result.forEach(element => {
                movieTitles.push(element.Title);
            });
            let moviesForPoll = [];
            while (moviesForPoll.length < args.count) {
                let movie = movieTitles[Math.floor(Math.random() * movieTitles.length)];
                if (!moviesForPoll.includes(movie)) {
                    moviesForPoll.push(movie);
                }
            }
            xmlHttp.open('POST', 'https://www.strawpoll.me/api/v2/polls', false);
            xmlHttp.setRequestHeader('Content-Type', 'application/json');
            xmlHttp.send(JSON.stringify({
                'title': "Melon Patch Movie Night",
                'options': moviesForPoll,
                'multi': 'false'
            }));
            let respJson = JSON.parse(xmlHttp.responseText);
            return message.edit(`https://www.strawpoll.me/${respJson.id}`);
        });
    }
};

function getMovieFromDB(movieGenre, callback) {
    MongoClient.connect(mongoURL, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) {
            console.log(chalk.red(err));
        }
        let dbo = db.db(process.env.MONGO_DB);
        dbo.collection(process.env.MONGO_COL).find({
            'Genre': {
                $in: [`${movieGenre}`]
            }
        }).toArray(function (err, result) {
            if (err) {
                console.log(chalk.red(err));
            }
            db.close();
            callback(result);
        });
    });
}