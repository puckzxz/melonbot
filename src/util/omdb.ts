import fetch from "node-fetch";
import { OMDB_API_KEY } from "../config";

export interface IMovie {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: IRating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
}

interface IRating {
    Source: string;
    Value: string;
}

class OMDb {
    /**
     *
     * @param ID The IMDb Movie ID to search
     * @returns A Promise containing the movie information
     */
    public async GetMovieInfo(ID: string): Promise<IMovie> {
        return (await fetch(
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${ID}`,
        )
            .then((res) => res.json())
            .then((json) => JSON.parse(JSON.stringify(json)))) as IMovie;
    }
}

const omdb = new OMDb();

export default omdb;
