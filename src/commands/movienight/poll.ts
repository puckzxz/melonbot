import { Message, RichEmbed } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { Movie } from "../../entity/Movie";
import db from "../../util/db";

interface ICmdArgs {
    genre: string;
}

export default class PollCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            args: [
                {
                    default: "all",
                    key: "genre",
                    prompt: "What genre would you like?",
                    type: "string",
                },
            ],
            description: "Creates a poll to vote on movies to watch",
            group: "movienight",
            memberName: "poll",
            name: "poll",
        });
    }

    // @ts-ignore Types are out of date and requrie you to return a message
    public async run(msg: CommandMessage, args: ICmdArgs) {
        let movies: Movie[];
        if (args.genre === "all") {
            movies = await db.GetAllMovies();
        } else {
            movies = await db.GetMoviesByGenre(args.genre);
        }
        movies = shuffle(movies);
        movies = movies.slice(0, 5);
        const embed = new RichEmbed();
        embed.setTitle("Melon Movie Night");
        embed.setThumbnail(
            "https://cdn.discordapp.com/attachments/190237146546831362/621808012058951701/MP_Animated2.gif",
        );
        embed.setColor(0x00ff00);
        movies.forEach((m, i) => {
            embed.addField(`${i + 1}. ${m.title}`, m.plot);
        });
        msg.embed(embed).then(async (message: Message) => {
            for (let i = 0; i < movies.length; i++) {
                await message.react(reactions[i]);
            }
        });
    }
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a: any): any {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const reactions = [
    "\u0031\u20E3",
    "\u0032\u20E3",
    "\u0033\u20E3",
    "\u0034\u20E3",
    "\u0035\u20E3",
];
