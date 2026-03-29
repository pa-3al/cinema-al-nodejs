import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./room.entity";

@Entity("room-image")
export class RoomImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    imageUrl: string;

    @Column()
    displayOrder : number;

    @Column({ name: "room_id" })
    roomId: number;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

    @ManyToOne(() => Room, (room) => room.roomImage)
    @JoinColumn({ name: "room_id" })
    room: Room;
}
