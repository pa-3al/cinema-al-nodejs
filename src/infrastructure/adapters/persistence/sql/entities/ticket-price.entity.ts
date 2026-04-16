import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ProjectionType } from "./projection-type.entity";

@Entity("ticket_price")
export class TicketPrice {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: "price",
        type: "float",
        nullable: false,
    })
    price: number;

    @Column({
        name: "start_activity",
        type: "timestamp",
        nullable: false,
    })
    startActivity: Date;

    @Column({
        name: "end_activity",
        type: "timestamp",
        nullable: false,
    })
    endActivity: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt: Date;

    @ManyToOne(() => ProjectionType, (projectionType) => projectionType.ticketPrices, { nullable: false })
    @JoinColumn({ name: "projection_type_id" })
    projectionType: ProjectionType;
}
