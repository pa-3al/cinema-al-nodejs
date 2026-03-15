import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("movie-genre")
export class MovieGenre {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type : "varchar",
        nullable: false,
        length: 255,
    })
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}