const { Command } = require("discord.js-commando");

const config = require("../../config");

module.exports = class ReactSetRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "rrole",
      group: "react",
      memberName: "rrole",
      description: "Sets the role to give for reaction roles",
      examples: [`${client.commandPrefix}rrole <ROLE>`],
      userPermissions: ["ADMINISTRATOR"],
      guildOnly: true,
      args: [
        {
          key: "role",
          prompt: "What role would you like to set?",
          type: "string",
          default: "x"
        }
      ]
    });
  }

  async run(msg, args) {
    if (args.role !== "x") {
      config.ReactMessageRole = args.role;
    } else {
      config.ReactMessageRole
        ? msg.say(config.ReactMessageRole)
        : msg.say("No role set");
    }
  }
};
