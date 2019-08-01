const { Command } = require("discord.js-commando");
const chalk = require("chalk");
const MongoClient = require("mongodb").MongoClient;
const config = require("../../config")

module.exports = class SubmitCommand extends Command {
  constructor(client) {
    super(client, {
      name: "genre",
      group: "movienight",
      memberName: "genre",
      description: "Gets the amount of movies in a genre from the database",
      examples: [`${client.commandPrefix}genre <GENRE>`],
      guildOnly: true,
      args: [
        {
          key: "genre",
          prompt: "What genre would you like to search?",
          type: "string",
          validate: genre => {
            if (validGenres.includes(genre)) {
              return true;
            } else {
              let genreList = validGenres.join();
              let genres = genreList.replace(/,/g, "\n");
              return `Your genre is not in the list of valid genres, This is the valid list of genres\n
                    ${genres}\n`;
            }
          }
        }
      ]
    });
  }

  async run(msg, args) {
    var message = await msg.say(
      `Getting all movies with the **${args.genre}** genre from the database...`
    );
    getGenreCount(args.genre, function(result) {
      return message.edit(
        `There are **${result.length}** movies with the genre **${
          args.genre
        }** in the Melon Patch Movie Database!`
      );
    });
  }
};

function getGenreCount(movieGenre, callback) {
  MongoClient.connect(
    config.MONGO_URL,
    {
      useNewUrlParser: true
    },
    function(err, db) {
      if (err) {
        console.log(chalk.red(err));
      }
      var dbo = db.db(config.MONGO_DB);
      dbo
        .collection(config.MONGO_COL)
        .find({
          Genre: {
            $in: [`${movieGenre}`]
          }
        })
        .toArray(function(err, result) {
          if (err) {
            console.log(chalk.red(err));
          }
          db.close();
          callback(result);
        });
    }
  );
}

let validGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film Noir",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Short",
  "Sport",
  "Superhero",
  "Thriller",
  "War",
  "Western"
];
