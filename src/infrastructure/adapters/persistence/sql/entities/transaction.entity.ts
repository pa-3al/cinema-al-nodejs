import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("transactions")
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    type: string;

    @Column({ type: 'float' })
    amount: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.transactions)
    user: User;
}