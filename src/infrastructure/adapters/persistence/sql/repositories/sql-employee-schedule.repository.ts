import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { EmployeeSchedule } from "../entities/employee-schedule.entity";
import { EmployeeScheduleRepositoryPort, IConflictCheckFilters, IDateRangeFilters } from "src/core/domain/employee/port/schedule-repository.port";

@Injectable()
export class SqlEmployeeScheduleRepository implements EmployeeScheduleRepositoryPort {
    constructor(
        @InjectRepository(EmployeeSchedule)
        private readonly repository: Repository<EmployeeSchedule>
    ) {}

    async save(schedule: Partial<EmployeeSchedule>): Promise<EmployeeSchedule> {
        return this.repository.save(schedule);
    }

    async findSchedulesByEmployeeId(employeeId: string): Promise<EmployeeSchedule[]> {
        return this.repository.find({
            where: { employee: { id: employeeId } },
            order: { startTime: 'ASC' }
        });
    }

    async checkConflict(filters: IConflictCheckFilters): Promise<boolean> {
        const query = this.repository.createQueryBuilder("schedule")
            .innerJoin("schedule.employee", "employee")
            .where("employee.position = :position", { position: filters.position })
            .andWhere("schedule.startTime < :end", { end: filters.end })
            .andWhere("schedule.endTime > :start", { start: filters.start });

        if (filters.excludeScheduleId) {
            query.andWhere("schedule.id != :excludeScheduleId", { excludeScheduleId: filters.excludeScheduleId });
        }

        const conflict = await query.getOne();
        return !!conflict;
    }

    async findById(id: string): Promise<EmployeeSchedule | null> {
        return this.repository.findOne({ where: { id }, relations: ['employee'] });
    }

    async update(id: string, schedule: Partial<EmployeeSchedule>): Promise<EmployeeSchedule | null> {
        await this.repository.update(id, schedule);
        return this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.repository.softDelete(id);
    }

    async findByEmployeeIdAndDateRange(filters: IDateRangeFilters): Promise<EmployeeSchedule[]> {
        return this.repository.find({
            where: {
                employee: { id: filters.employeeId },
                startTime: Between(filters.startDate, filters.endDate)
            },
            order: { startTime: 'ASC' }
        });
    }
}