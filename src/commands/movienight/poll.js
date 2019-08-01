const { Command } = require("discord.js-commando");
const { XMLHttpRequest } = require("xmlhttprequest");
const MongoClient = require("mongodb").MongoClient;
const chalk = require("chalk");
const config = require("../../config")
let xmlHttp = new XMLHttpRequest();

module.exports = class PollCommand extends Command {
  constructor(client) {
    super(client, {
      name: "poll",
      group: "movienight",
      memberName: "poll",
      description:
        "Creates a strawpoll based on the genre and amount of movies ",
      examples: [`${client.commandPrefix}poll <GENRE> <MOVIE AMOUNT>`],
      guildOnly: true,
      args: [
        {
          key: "genre",
          prompt: "What movie genre would you like? Ex. Sci-Fi",
          type: "string",
          default: "any"
        },
        {
          key: "count",
          prompt: "How many movies will be in the poll? 2-10",
          type: "string",
          validate: count => {
            if (count >= 2 && count < 20) {
              return true;
            } else {
              return "The count parameter must be at least 2!";
            }
          }
        }
      ]
    });
  }

  hasPermission(msg) {
    return msg.member.roles.some(role => validRoles.includes(role.name));
  }

  async run(msg, args) {
    let message = await msg.say("Creating poll...");
    if (args.genre === "any") {
      getAllMoviesFromDB(function(result) {
        let movieTitles = [];
        if (result.length < 2) {
          return message.edit(
            `There are not enough movies with the **${
              args.genre
            }** tag!\nThere must be **at least** 2 movies!\nThere may not be enough movies that fit that genre or you might of misspelled the genre!`
          );
        }
        result.forEach(element => {
          movieTitles.push(element.Title);
        });
        let moviesForPoll = [];
        while (moviesForPoll.length < args.count) {
          let movie =
            movieTitles[Math.floor(Math.random() * movieTitles.length)];
          if (!moviesForPoll.includes(movie)) {
            moviesForPoll.push(movie);
          }
        }
        xmlHttp.open("POST", "https://www.strawpoll.me/api/v2/polls", false);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send(
          JSON.stringify({
            title: "Melon Patch Movie Night",
            options: moviesForPoll,
            multi: "false"
          })
        );
        let respJson = JSON.parse(xmlHttp.responseText);
        return message.edit(`https://www.strawpoll.me/${respJson.id}`);
      });
    } else {
      getMoviesWithGenreFromDB(args.genre, function(result) {
        let movieTitles = [];
        if (result.length < 2) {
          return message.edit(
            `There are not enough movies with the **${
              args.genre
            }** tag!\nThere must be **at least** 2 movies!\nThere may not be enough movies that fit that genre or you might of misspelled the genre!`
          );
        }
        if (result.length < args.count) {
          msg.say(
            `There are not **${args.count}** movies with the **${
              args.genre
            }** tag!  I will try my best with the movies I have!`
          );
          args.count = result.length;
        }
        result.forEach(element => {
          movieTitles.push(element.Title);
        });
        let moviesForPoll = [];
        while (moviesForPoll.length < args.count) {
          let movie =
            movieTitles[Math.floor(Math.random() * movieTitles.length)];
          if (!moviesForPoll.includes(movie)) {
            moviesForPoll.push(movie);
          }
        }
        xmlHttp.open("POST", "https://www.strawpoll.me/api/v2/polls", false);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send(
          JSON.stringify({
            title: "Melon Patch Movie Night",
            options: moviesForPoll,
            multi: "false"
          })
        );
        let respJson = JSON.parse(xmlHttp.responseText);
        return message.edit(`https://www.strawpoll.me/${respJson.id}`);
      });
    }
  }
};

function getAllMoviesFromDB(callback) {
  MongoClient.connect(
    config.MONGO_URL,
    {
      useNewUrlParser: true
    },
    function(err, db) {
      if (err) {
        console.log(chalk.red(err));
      }
      let dbo = db.db(config.MONGO_DB);
      dbo
        .collection(config.MONGO_COL)
        .find({})
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

function getMoviesWithGenreFromDB(movieGenre, callback) {
  MongoClient.connect(
    config.MONGO_URL,
    {
      useNewUrlParser: true
    },
    function(err, db) {
      if (err) {
        console.log(chalk.red(err));
      }
      let dbo = db.db(config.MONGO_DB);
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

let validRoles = ["The First Melon", "High Priest Of Melontology"];
