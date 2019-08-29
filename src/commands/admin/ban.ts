import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { DEFAULT_BAN_MESSAGE } from "../../config";

interface ICmdArgs {
    user: string;
    reason?: string;
}

export default class BanCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            args: [
                {
                    key: "user",
                    prompt: "What user would you like to ban?",
                    type: "user",
                },
                {
                    default: "",
                    key: "reason",
                    prompt: "What is the reason for the ban?",
                    type: "string",
                },
            ],
            description: "Bans a specified user with an optional reason",
            examples: [`${client.commandPrefix}ban <USER> <REASON?>`],
            group: "admin",
            guildOnly: true,
            memberName: "ban",
            name: "ban",
        });
    }

    public async run(msg: CommandMessage, args: ICmdArgs) {
        const member = msg.guild.member(args.user);
        const reason = args.reason ? args.reason : DEFAULT_BAN_MESSAGE;
        member.ban(reason);
        return msg.say(
            `Banned **${member.displayName}** with reason: ${reason}`,
        );
    }
}
