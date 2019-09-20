import { createConnection } from "typeorm";
import { Movie } from "../entity/Movie";
import { Reaction } from "../entity/Reaction";
import { ReactionMessage } from "../entity/ReactionMessage";

class DB {
    constructor() {
        this.init();
    }

    public async GetMessage(ID: string): Promise<ReactionMessage> {
        return ReactionMessage.findOne(ID);
    }

    public async GetAllMessages(): Promise<ReactionMessage[]> {
        return ReactionMessage.find();
    }

    public async RemoveMessage(ID: string) {
        ReactionMessage.findOne(ID).then((msg) => {
            msg.remove();
        });
    }

    public async InsertMessage(message: ReactionMessage) {
        ReactionMessage.save(message);
    }

    public async MessageExists(ID: string): Promise<boolean> {
        return ReactionMessage.findOne(ID) ? true : false;
    }

    public async ReplaceRoleInMessage(
        ID: string,
        oldRole: string,
        newRole: string,
    ) {
        ReactionMessage.findOne(ID).then((msg) => [
            msg.reactions.map((r) => {
                if (r.role === oldRole) {
                    r.role = newRole;
                }
            }),
            msg.save(),
        ]);
    }

    public async InsertMovie(movie: Movie) {
        Movie.save(movie);
    }

    public async GetMoviesByGenre(genre: string): Promise<Movie[]> {
        return Movie.findByGenre(genre);
    }

    private async init() {
        await createConnection({
            database: "./data/data.db",
            entities: [Movie, ReactionMessage, Reaction],
            logging: false,
            synchronize: true,
            type: "sqlite",
        });
    }
}

const db = new DB();

export default db;
