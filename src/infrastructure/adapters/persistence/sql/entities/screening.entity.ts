import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Movie } from "./movie.entity";
import { Room } from "./room.entity";

@Entity("screening")
export class Screening {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "timestamp",
        nullable: false
    })
    startTime: Date;

    @Column({
        type: "timestamp",
        nullable: false
    })
    endTime: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Movie, (movie) => movie.screenings, { nullable: false })
    @JoinColumn({ name: "movie_id" })
    movie: Movie;

    @ManyToOne(() => Room, (room) => room.screenings, { nullable: false })
    @JoinColumn({ name: "room_id" })
    room: Room;
}
