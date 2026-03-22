import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomImage } from "./room-image.entity";

@Entity("room")
export class Room {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    description : string;

    @Column()
    capacity : number;

    @Column()
    isMaintenance : boolean;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

    @OneToMany(() => RoomImage, (RoomImage) => RoomImage.room)
    roomImage: RoomImage[];
}
