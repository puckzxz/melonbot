const { Command } = require("discord.js-commando");

const config = require("./.config/config");

module.exports = class RemoveRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      group: "admin",
      memberName: "ban",
      description: "Bans a specified user with an optional reason",
      examples: [`${client.commandPrefix}ban <USER> <REASON?>`],
      clientPermissions: ["BAN_MEMBERS"],
      userPermissions: ["BAN_MEMBERS"],
      guildOnly: true,
      args: [
        {
          key: "user",
          prompt: "What user would you like to ban?",
          type: "user"
        },
        {
          key: "reason",
          prompt: "What is the reason for the ban?",
          type: "string",
          default: ""
        }
      ]
    });
  }

  async run(msg, args) {
    let member = msg.guild.member(args.user);
    let reason = args.reason ? args.reason : config.DefaultBanMessage;
    member.ban(reason);
  }
};
