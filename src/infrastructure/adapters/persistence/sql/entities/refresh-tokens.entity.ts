import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";

@Entity("refresh-tokens")
export class RefreshToken {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    token: string;

    @Column({
        type: 'timestamp',
        nullable: false,
        name: 'expired_at'
    })
    expiredAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    @JoinColumn({ name: "user_id" })
    user: User;

}