import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Movie extends BaseEntity {
    static findByGenre(genre: string) {
        return this.createQueryBuilder("movie")
        .where("movie.genres LIKE :genres", { genres: `%${genre}%` })
        .getMany();
    }

    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    rated: string;

    @Column()
    runtime: string;

    @Column("simple-array")
    genres: string[];

    @Column()
    plot: string;

    @Column()
    posterURL: string;

    @Column()
    rating: string;
}
