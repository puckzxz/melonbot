const { Command } = require("discord.js-commando");

module.exports = class RemoveRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setrole",
      group: "admin",
      memberName: "setrole",
      description: "Sets a specified role for the given user",
      examples: [`${client.commandPrefix}setrole <ROLE> <USER>`],
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      guildOnly: true,
      args: [
        {
          key: "role",
          prompt: "What role would you like to set?",
          type: "string"
        },
        {
          key: "user",
          prompt: "What user would you like to give the role to?",
          type: "user"
        }
      ]
    });
  }

  async run(msg, args) {
    let member = msg.guild.member(args.user);
    let role = msg.guild.roles.find(role => role.name === args.role);
    if (!member.roles.has(role.id)) {
      member.setRoles([role]);
      msg.say(`Set \`${role.name}\` role to ${member.user.tag} - ${member.id}`);
    } else {
      msg.say(
        `Could not set the ${role.name} role since ${
          member.user.tag
        } already has that role`
      );
    }
  }
};
