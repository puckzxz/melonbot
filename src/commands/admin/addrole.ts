import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

interface ICmdArgs {
    user: string;
    role: string;
}

export default class AddRoleCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            args: [
                {
                    key: "role",
                    prompt: "What role would you like to give?",
                    type: "string",
                },
                {
                    key: "user",
                    prompt: "What user would you like to give the role to?",
                    type: "user",
                },
            ],
            description: "Adds a specified role to the given user",
            examples: [`${client.commandPrefix}addrole <ROLE> <USER>`],
            group: "admin",
            guildOnly: true,
            memberName: "addrole",
            name: "addrole",
        });
    }

    public async run(msg: CommandMessage, args: ICmdArgs) {
        const member = msg.guild.member(args.user);
        const role = msg.guild.roles.find((x) => x.name === args.role);
        if (!role) {
            return msg.say(`Role **${args.role}** does not exist.`);
        }
        if (!member.roles.has(role.id)) {
            member.addRole(role);
            return msg.say(
                `Added **${member.displayName}** to role **${role.name}**`,
            );
        } else {
            return msg.say(
                `Could not add **${member.displayName}** to role **${role.name}** since they already have that role`,
            );
        }
    }
}
