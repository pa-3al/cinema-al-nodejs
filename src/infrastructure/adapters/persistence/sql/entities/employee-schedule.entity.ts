import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity("employees_schedules")
export class EmployeeSchedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp', nullable: false })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: false })
    endTime: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Employee, (employee) => employee.schedules)
    @JoinColumn({ name: "employee_id" })
    employee: Employee;
}