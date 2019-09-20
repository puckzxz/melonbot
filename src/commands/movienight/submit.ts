import { RichEmbed } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { Movie } from "../../entity/Movie";
import db from "../../util/db";
import omdb from "../../util/omdb";

interface ICmdArgs {
    imdbURL: string;
}

export default class SubmitCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            args: [
                {
                    key: "imdbURL",
                    prompt: "What is the IMDb URL of the movie you want to add?",
                    type: "string",
                },
            ],
            description: "Adds a movie to the database",
            group: "movienight",
            memberName: "submit",
            name: "submit",
        });
    }
    // @ts-ignore
    public async run(msg: CommandMessage, args: ICmdArgs) {
        // Try to get our ID from the URL
        let id = args.imdbURL.split("title/")[1];
        // Sometimes IMDb will include other queries in the URL and we need to remove those
        if (id.includes("/")) {
            id = id.split("/")[0];
        }
        const movieInfo = await omdb.GetMovieInfo(id);
        const movie = new Movie();
        movie.id = movieInfo.imdbID.slice(2);
        movie.title = movieInfo.Title;
        movie.rated = movieInfo.Rated;
        movie.runtime = movieInfo.Runtime;
        movie.genres = movieInfo.Genre.split(", ");
        movie.plot = movieInfo.Plot;
        movie.posterURL = movieInfo.Poster;
        movie.rating = movieInfo.imdbRating;
        db.InsertMovie(movie);
        const embed = new RichEmbed()
            .setTitle(movieInfo.Title)
            .setDescription(movieInfo.Plot)
            .setThumbnail(movieInfo.Poster)
            .setURL(args.imdbURL)
            .addField("Genre", movieInfo.Genre)
            .addField("Rated", movieInfo.Rated, true)
            .addField("Rating", movieInfo.imdbRating, true)
            .addField("Runtime", movieInfo.Runtime, true)
            .addField("Released", movieInfo.Year, true)
            .setColor(0x00ff00);
        return msg.embed(embed);
    }
}
