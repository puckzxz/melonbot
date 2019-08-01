const { Command } = require("discord.js-commando");
const chalk = require("chalk");
const MongoClient = require("mongodb").MongoClient;
const config = require("../../config")

module.exports = class SubmitCommand extends Command {
  constructor(client) {
    super(client, {
      name: "delete",
      group: "movienight",
      memberName: "delete",
      description: "Deletes a movie from the Melon Patch Movie Database!",
      examples: [`${client.commandPrefix}delete <MOVIE NAME>`],
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

  hasPermission(msg) {
    return msg.member.roles.some(role => validRoles.includes(role.name));
  }

  async run(msg, args) {
    let message = await msg.say(`Deleting ${args.title} from the database...`);
    deleteMovieByTitle(args.title);
    message.edit(`Deleted **${args.title}** from the database`);
  }
};

function deleteMovieByTitle(movieTitle) {
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
      dbo.collection(config.MONGO_COL).deleteOne(
        {
          Title: `${movieTitle}`
        },
        function(err) {
          if (err) {
            console.log(chalk.red(err));
          }
          console.log(`Deleted ${movieTitle}`);
          db.close();
        }
      );
    }
  );
}

let validRoles = ["The First Melon", "High Priest Of Melontology"];
