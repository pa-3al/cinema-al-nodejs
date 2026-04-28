import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinColumn, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Screening } from "./screening.entity";
import {MovieGenre} from "./movie-genre.entity";

@Entity("movie")
export class Movie {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 255,
        nullable: false
    })
    title: string;

    @Column({
        type: "text",
        nullable: false
    })
    synopsis: string;

    @Column({
        type: "int",
        nullable: false
    })
    durationMinutes: number;

    @Column({
        type: "date",
        nullable: false
    })
    releaseDate: Date;

    @Column({
        type: "varchar",
        nullable: true
    })
    posterUrl: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => Screening, (screening) => screening.movie)
    screenings: Screening[];

    @ManyToOne(() => MovieGenre, { nullable: true })
    @JoinColumn({ name: "genre_id" })
    genre: MovieGenre;
}
