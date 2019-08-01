const { Command } = require("discord.js-commando");

const config = require("../../config");

module.exports = class SetEmojiCommand extends Command {
  constructor(client) {
    super(client, {
      name: "remoji",
      group: "react",
      memberName: "remoji",
      description: "Sets the role to give for reaction roles",
      examples: [`${client.commandPrefix}remoji <EMOJI>`],
      userPermissions: ["ADMINISTRATOR"],
      guildOnly: true,
      args: [
        {
          key: "emoji",
          prompt: "What emoji would you like to set?",
          type: "string",
          default: "x"
        }
      ]
    });
  }

  async run(msg, args) {
    if (args.emoji !== "x") {
        config.ReactMessageEmoji = args.emoji;
    } else {
      config.ReactMessageEmoji
        ? msg.say(config.ReactMessageEmoji)
        : msg.say("No emoji set");
    }
  }
};
