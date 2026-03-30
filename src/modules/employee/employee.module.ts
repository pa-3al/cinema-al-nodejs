import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "../../core/application/cinema/employee/employee.service";
import { Employee } from "../../infrastructure/adapters/persistence/sql/entities/employee.entity";
import { EmployeeSchedule } from "../../infrastructure/adapters/persistence/sql/entities/employee-schedule.entity";
import { User } from "../../infrastructure/adapters/persistence/sql/entities/user.entity";
import { SqlEmployeeRepository } from "../../infrastructure/adapters/persistence/sql/repositories/sql-employee.repository";
import { SqlEmployeeScheduleRepository } from "../../infrastructure/adapters/persistence/sql/repositories/sql-employee-schedule.repository";
import { SqlUserRepository } from "../../infrastructure/adapters/persistence/sql/repositories/sql-user.repository";
import { EMPLOYEE_SERVICE, EMPLOYEE_REPOSITORY, EMPLOYEE_SCHEDULE_REPOSITORY, USER_REPOSITORY } from "../../core/domain/global/token";

@Module({
    imports: [TypeOrmModule.forFeature([Employee, EmployeeSchedule, User])],
    controllers: [EmployeeController],
    providers: [
        { provide: EMPLOYEE_SERVICE, useClass: EmployeeService },
        { provide: EMPLOYEE_REPOSITORY, useClass: SqlEmployeeRepository },
        { provide: EMPLOYEE_SCHEDULE_REPOSITORY, useClass: SqlEmployeeScheduleRepository },
        { provide: USER_REPOSITORY, useClass: SqlUserRepository }
    ],
    exports: [EMPLOYEE_SERVICE]
})
export class EmployeeModule {}