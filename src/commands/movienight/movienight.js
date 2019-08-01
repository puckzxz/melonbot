const { Command } = require("discord.js-commando");

module.exports = class MovieNightCommand extends Command {
  constructor(client) {
    super(client, {
      name: "movienight",
      group: "movienight",
      memberName: "movienight",
      description: "Opts in or opts out of the Melon Patch Movie Night role",
      examples: [`${client.commandPrefix}movienight`],
      guildOnly: true
    });
  }

  async run(msg) {
    let role = msg.guild.roles.find(role => role.name === "movienight");
    if (!msg.member.roles.has(role.id)) {
      msg.member.addRole(role);
      msg.reply(`I added you to the \`${role.name}\` role!`);
    } else {
      msg.member.removeRole(role);
      msg.reply(`I removed you from the \`${role.name}\` role... :(`);
    }
  }
};
