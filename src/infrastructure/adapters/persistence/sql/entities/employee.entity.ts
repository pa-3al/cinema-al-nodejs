import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { EmployeeSchedule } from "./employee-schedule.entity";

@Entity("employees")
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    position: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => EmployeeSchedule, (schedule) => schedule.employee)
    schedules: EmployeeSchedule[];
}