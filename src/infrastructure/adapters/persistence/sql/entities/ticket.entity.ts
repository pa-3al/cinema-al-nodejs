import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { TicketUsage } from "./ticket-usage.entity";

export enum TicketType {
    SOLO = "solo",
    TEN = "ten",
}

@Entity("tickets")
export class Ticket {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: "ticket_type",
        type: "varchar",
        length: 10,
        nullable: false,
    })
    ticketType: TicketType;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt: Date;

    @ManyToOne(() => User, (user) => user.tickets, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => TicketUsage, (usage) => usage.ticket)
    usages: TicketUsage[];
}
