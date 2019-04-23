const { Command } = require("discord.js-commando");

module.exports = class RemoveRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "removerole",
      group: "admin",
      memberName: "removerole",
      description: "Removes a specified role from the given user",
      examples: [`${client.commandPrefix}removerole <ROLE> <USER>`],
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      guildOnly: true,
      args: [
        {
          key: "role",
          prompt: "What role would you like to remove?",
          type: "string"
        },
        {
          key: "user",
          prompt: "What user would you like to remove the role from?",
          type: "user"
        }
      ]
    });
  }

  async run(msg, args) {
    let member = msg.guild.member(args.user);
    let role = msg.guild.roles.find(role => role.name === args.role);
    if (member.roles.has(role.id)) {
      member.removeRole(role);
      msg.say(`Removed \`${role.name}\` role from ${member.user.tag} - ${member.id}`);
    } else {
      msg.say(
        `Could not remove the ${role.name} role since ${
          member.user.tag
        } does not have that role`
      );
    }
  }
};
