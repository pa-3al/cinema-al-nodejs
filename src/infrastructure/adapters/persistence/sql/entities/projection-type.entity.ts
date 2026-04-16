import {Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { TicketPrice } from "./ticket-price.entity";

@Entity("projection-type")
export class ProjectionType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: "type_name",
        type: "varchar",
        nullable: false,
        length: 255,
    })
    typeName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => TicketPrice, (ticketPrice) => ticketPrice.projectionType)
    ticketPrices: TicketPrice[];
}
