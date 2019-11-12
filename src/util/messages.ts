import { Reaction } from "../entity/Reaction";
import { ReactionMessage } from "../entity/ReactionMessage";

/**
 *
 * @param messages The ReactionMessage array to format
 * @returns A formatted message to be sent in Discord
 */
export function FormatReactionMessages(messages: ReactionMessage[]): string {
    let formatted: string = "";
    messages.forEach((x: ReactionMessage) => {
        formatted += `Msg ID: *${x.id}*\n`;
        x.reactions.forEach((y: Reaction, i: number) => {
            formatted += `\t${i}. Emoji: ${y.emoji.includes(":") ? `<:${y.emoji}>` : y.emoji}\n\t\t- Role: **${y.role}**\n`;
        });
    });
    return formatted;
}

/**
 *
 * @param message The ReactionMessage to format
 * @returns A formatted message to be sent in Discord
 */
export function FormatReactionMessage(message: ReactionMessage): string {
    let formatted: string = "";
    formatted += `Msg ID: *${message.id}*\n`;
    message.reactions.forEach((y: Reaction, i: number) => {
        formatted += `\t${i}. Emoji: ${y.emoji.includes(":") ? `<:${y.emoji}>` : y.emoji}\n\t\t- Role: **${y.role}**\n`;
    });
    return formatted;
}
