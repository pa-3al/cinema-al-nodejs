import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Ticket } from "./ticket.entity";
import { Screening } from "./screening.entity";

@Entity("ticket_usage")
@Index(["ticket", "screening"], { unique: true })
export class TicketUsage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: "used_at",
        type: "timestamp",
        nullable: false,
    })
    usedAt: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt: Date;

    @ManyToOne(() => Ticket, (ticket) => ticket.usages, { nullable: false })
    @JoinColumn({ name: "ticket_id" })
    ticket: Ticket;

    @ManyToOne(() => Screening, (screening) => screening.ticketUsages, { nullable: false })
    @JoinColumn({ name: "screening_id" })
    screening: Screening;
}
