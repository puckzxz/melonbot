import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { DEFAULT_KICK_MESSAGE } from "../../config";

interface ICmdArgs {
    user: string;
    reason?: string;
}

export default class KickCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            args: [
                {
                    key: "user",
                    prompt: "What user would you like to kick?",
                    type: "user",
                },
                {
                    default: "",
                    key: "reason",
                    prompt: "What is the reason for the kick?",
                    type: "string",
                },
            ],
            description: "Kicks a specified user with an optional reason",
            examples: [`${client.commandPrefix}kick <USER> <REASON?>`],
            group: "admin",
            guildOnly: true,
            memberName: "kick",
            name: "kick",
        });
    }

    public async run(msg: CommandMessage, args: ICmdArgs) {
        const member = msg.guild.member(args.user);
        const reason = args.reason ? args.reason : DEFAULT_KICK_MESSAGE;
        member.kick(reason);
        return msg.say(
            `Kicked **${member.displayColor}** with reason: ${reason}`,
        );
    }
}
