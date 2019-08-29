import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

interface ICmdArgs {
    user: string;
    role: string;
}

export default class RemoveRoleCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            args: [
                {
                    key: "role",
                    prompt: "What role would you like to remove?",
                    type: "string",
                },
                {
                    key: "user",
                    prompt: "What user would you like to remove the role from?",
                    type: "user",
                },
            ],
            description: "Removes a specified role from the given user",
            examples: [`${client.commandPrefix}removerole <ROLE> <USER>`],
            group: "admin",
            guildOnly: true,
            memberName: "removerole",
            name: "removerole",
        });
    }

    public async run(msg: CommandMessage, args: ICmdArgs) {
        const member = msg.guild.member(args.user);
        const role = msg.guild.roles.find((x) => x.name === args.role);
        if (member.roles.has(role.id)) {
            member.removeRole(role);
            return msg.say(
                `Removed **${role.name}** role from ${member.displayName}`,
            );
        } else {
            return msg.say(
                `Could not remove **${role.name}** from **${member.displayName}** does not have that role`,
            );
        }
    }
}
