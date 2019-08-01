const { Command } = require("discord.js-commando");

const config = require("../../config");

module.exports = class SetMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: "rmessage",
      group: "react",
      memberName: "rmessage",
      description: "Sets the message ID for reaction roles",
      examples: [`${client.commandPrefix}rmessage <MESSAGE ID>`],
      userPermissions: ["ADMINISTRATOR"],
      guildOnly: true,
      args: [
        {
          key: "id",
          prompt: "What message ID would you like to set?",
          type: "string",
          default: "x"
        }
      ]
    });
  }

  async run(msg, args) {
    if (args.id !== "x") {
      config.ReactMessageID = args.id;
    } else {
      config.ReactMessageID
        ? msg.say(config.ReactMessageID)
        : msg.say("No message ID set");
    }
  }
};
