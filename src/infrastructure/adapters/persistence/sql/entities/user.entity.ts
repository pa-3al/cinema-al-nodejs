import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {RefreshToken} from "./refresh-tokens.entity";
import {Employee} from "./employee.entity";
import { Ticket } from "./ticket.entity";
import { Transaction } from "./transaction.entity";

@Entity("users")
export class User{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        select: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    firstname : string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    lastname : string;

    @Column({
        type: 'enum',
        enum: ['user', 'employee', 'super_admin'],
        default: 'user'
    })
    role: string;

    @Column({
        type: 'float',
        default: 0.0
    })
    balance: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => RefreshToken, (refreshTokens) => refreshTokens.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets: Ticket[];

    @OneToOne(() => Employee, (employee) => employee.user)
    employee: Employee;

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];
}