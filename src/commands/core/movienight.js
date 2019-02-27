const { Command } = require("discord.js-commando");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env")
});

module.exports = class SubmitCommand extends Command {
  constructor(client) {
    super(client, {
      name: "movienight",
      group: "core",
      memberName: "movienight",
      description: "Opts in or opts out of the Melon Patch Movie Night role",
      examples: ["movienight"],
      guildOnly: true
    });
  }

  async run(msg) {
    let role = msg.guild.roles.find(role => role.name === "MovieNight");
    if (!msg.member.roles.has(role.id)) {
      msg.member.addRole(role);
      msg.reply("I added you to the `MovieNight` role!");
    } else {
      msg.member.removeRole(role);
      msg.reply("I removed you from the `MovieNight` role... :(");
    }
  }
};
