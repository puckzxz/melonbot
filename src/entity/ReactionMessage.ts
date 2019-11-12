import { BaseEntity, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Reaction } from "./Reaction";

@Entity()
export class ReactionMessage extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @OneToMany(type => Reaction, reaction => reaction.owner, { eager: true, cascade: true })
    reactions: Reaction[];
}
