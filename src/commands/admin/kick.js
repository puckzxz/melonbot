const { Command } = require("discord.js-commando");

const config = require("./.config/config");

module.exports = class RemoveRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      group: "admin",
      memberName: "kick",
      description: "Kicks a specified user with an optional reason",
      examples: [`${client.commandPrefix}kick <USER> <REASON?>`],
      clientPermissions: ["KICK_MEMBERS"],
      userPermissions: ["KICK_MEMBERS"],
      guildOnly: true,
      args: [
        {
          key: "user",
          prompt: "What user would you like to kick?",
          type: "user"
        },
        {
          key: "reason",
          prompt: "What is the reason for the kick?",
          type: "string",
          default: ""
        }
      ]
    });
  }

  async run(msg, args) {
    let member = msg.guild.member(args.user);
    let reason = args.reason ? args.reason : config.DefaultKickMessage;
    member.kick(reason);
  }
};
