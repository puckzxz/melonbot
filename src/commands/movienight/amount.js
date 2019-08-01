const { Command } = require("discord.js-commando");
const chalk = require("chalk");
const MongoClient = require("mongodb").MongoClient;
const config = require("../../config")

module.exports = class SubmitCommand extends Command {
  constructor(client) {
    super(client, {
      name: "amount",
      group: "movienight",
      memberName: "amount",
      description:
        "Gets the amount of times a movie is in the Melon Patch Movie Database!",
      examples: [`${client.commandPrefix}amount <MOVIE NAME>`],
      guildOnly: true,
      args: [
        {
          key: "title",
          prompt: "What title would you like to search?",
          type: "string"
        }
      ]
    });
  }

  async run(msg, args) {
    let message = await msg.say(
      `Getting the amount of entries for **${args.title}**...`
    );
    getAmountByTitle(args.title, function(result) {
      return message.edit(
        `**${args.title}** has **${result.length}** entries in the database!`
      );
    });
  }
};

function getAmountByTitle(movieTitle, callback) {
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
          Title: {
            $in: [`${movieTitle}`]
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
