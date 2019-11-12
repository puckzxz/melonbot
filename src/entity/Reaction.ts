import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReactionMessage } from "./ReactionMessage";

@Entity()
export class Reaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    emoji: string;

    @Column()
    role: string;

    @ManyToOne(type => ReactionMessage, reactionmessage => reactionmessage.reactions, { onDelete: "CASCADE" })
    owner: ReactionMessage;
}
