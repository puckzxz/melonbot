const { Command } = require("discord.js-commando");
const chalk = require("chalk");
const MongoClient = require("mongodb").MongoClient;
const config = require("../../config")

module.exports = class SubmitCommand extends Command {
  constructor(client) {
    super(client, {
      name: "count",
      group: "movienight",
      memberName: "count",
      description: "Gets the amount of movies in the database",
      examples: [`${client.commandPrefix}count`],
      guildOnly: true
    });
  }

  async run(msg) {
    var message = await msg.say("Getting all movies from the database...");
    getAllInDB(function(result) {
      return message.edit(
        `There are **${
          result.length
        }** movies in the Melon Patch Movie Database!`
      );
    });
  }
};

function getAllInDB(callback) {
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
