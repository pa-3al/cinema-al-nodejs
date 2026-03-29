import { EmployeeSchedule } from "src/infrastructure/adapters/persistence/sql/entities/employee-schedule.entity";

export interface IConflictCheckFilters {
    position: string;
    start: Date;
    end: Date;
    excludeScheduleId?: string;
}

export interface IDateRangeFilters {
    employeeId: string;
    startDate: Date;
    endDate: Date;
}

export interface EmployeeScheduleRepositoryPort {
    save(schedule: Partial<EmployeeSchedule>): Promise<EmployeeSchedule>;
    findSchedulesByEmployeeId(employeeId: string): Promise<EmployeeSchedule[]>;
    checkConflict(filters: IConflictCheckFilters): Promise<boolean>;
    findById(id: string): Promise<EmployeeSchedule | null>;
    update(id: string, schedule: Partial<EmployeeSchedule>): Promise<EmployeeSchedule | null>;
    delete(id: string): Promise<void>;
    findByEmployeeIdAndDateRange(filters: IDateRangeFilters): Promise<EmployeeSchedule[]>;
}