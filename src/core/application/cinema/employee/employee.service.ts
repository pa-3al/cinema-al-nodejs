import {Inject, Injectable, BadRequestException, NotFoundException, ConflictException} from "@nestjs/common";
import { IEmployeeServicePort } from "../../../domain/employee/port/employee-service.port";
import { EMPLOYEE_REPOSITORY, EMPLOYEE_SCHEDULE_REPOSITORY, USER_REPOSITORY } from "../../../domain/global/token";
import * as employeeRepositoryPort from "../../../domain/employee/port/employee-repository.port";
import * as scheduleRepositoryPort from "../../../domain/employee/port/schedule-repository.port";
import * as userRepositoryPort from "../../../domain/user/port/user-repository.port";
import { CreateEmployeeDto, CreateScheduleDto, EmployeeQueryDto, ScheduleQueryDto, UpdateEmployeeDto, UpdateScheduleDto } from "../../../domain/employee/dto/employee.dto";
import { getAllResponse } from "../../../domain/global/types/global.type";

@Injectable()
export class EmployeeService implements IEmployeeServicePort {
    constructor(
        @Inject(EMPLOYEE_REPOSITORY) private readonly employeeRepo: employeeRepositoryPort.EmployeeRepositoryPort,
        @Inject(EMPLOYEE_SCHEDULE_REPOSITORY) private readonly scheduleRepo: scheduleRepositoryPort.EmployeeScheduleRepositoryPort,
        @Inject(USER_REPOSITORY) private readonly userRepo: userRepositoryPort.UserRepositoryPort,
    ) {}

    private validateScheduleTimes(start: Date, end: Date): void {
        if (start >= end) {
            throw new BadRequestException("End date must be strictly after the start date.");
        }

        if (
            start.getFullYear() !== end.getFullYear() ||
            start.getMonth() !== end.getMonth() ||
            start.getDate() !== end.getDate()
        ) {
            throw new BadRequestException("Both dates must be on the same day.");
        }

        const startHour = start.getHours();
        const startMinutes = start.getMinutes();
        const endHour = end.getHours();
        const endMinutes = end.getMinutes();

        const startTotalMinutes = startHour * 60 + startMinutes;
        const endTotalMinutes = endHour * 60 + endMinutes;

        const minMinutes = 6 * 60;
        const maxMinutes = 23 * 60;

        if (startTotalMinutes < minMinutes || endTotalMinutes > maxMinutes) {
            throw new BadRequestException("Schedules must be between 06:00 and 23:00.");
        }
    }

    async createEmployee(dto: CreateEmployeeDto) {
        const user = await this.userRepo.findById(dto.userId);
        if (!user) throw new NotFoundException("User not found");

        await this.userRepo.updateRole(user.id, 'employee');
        const employee = await this.employeeRepo.save({ user, position: dto.position });
        return this.mapEmployeeToIso(employee);
    }

    async createSchedule(employeeId: string, dto: CreateScheduleDto) {
        const employee = await this.employeeRepo.findById(employeeId);
        if (!employee) throw new NotFoundException("Employee not found");

        const startDate = new Date(dto.startTime);
        const endDate = new Date(dto.endTime);

        this.validateScheduleTimes(startDate, endDate);

        const hasConflict = await this.scheduleRepo.checkConflict({
            position: employee.position,
            start: startDate,
            end: endDate
        });

        if (hasConflict) throw new BadRequestException("An employee is already assigned to this position during this time slot");

        const schedule = await this.scheduleRepo.save({
            startTime: startDate,
            endTime: endDate,
            employee
        });
        return this.mapScheduleToIso(schedule);
    }

    async getSchedulesByUserId(userId: string) {
        const employee = await this.employeeRepo.findByUserId(userId);
        if (!employee) throw new NotFoundException("Employee profile not found");
        const schedules = await this.scheduleRepo.findSchedulesByEmployeeId(employee.id);
        return schedules.map(s => this.mapScheduleToIso(s));
    }

    async findAllEmployees(query: EmployeeQueryDto): Promise<getAllResponse<any>> {
        const page = query.page || 1;
        const size = query.size || 10;

        const result = await this.employeeRepo.findAll({
            position: query.position,
            isWorkingNow: query.isWorkingNow,
            page,
            size
        });

        return {
            data: result.data.map(emp => this.mapEmployeeToIso(emp)),
            page: result.page,
            size: result.size,
            totalCount: result.totalCount,
            totalPage: result.totalPage
        };
    }

    async findEmployeeById(id: string) {
        const employee = await this.employeeRepo.findById(id);
        if (!employee) throw new NotFoundException("Employee not found");
        return this.mapEmployeeToIso(employee);
    }

    async updateEmployee(id: string, dto: UpdateEmployeeDto) {
        const employee = await this.employeeRepo.update(id, dto);
        if (!employee) throw new NotFoundException("Employee not found");
        return this.mapEmployeeToIso(employee);
    }

    async getEmployeeSchedules(id: string, query: ScheduleQueryDto) {
        const employee = await this.employeeRepo.findById(id);
        if (!employee) throw new NotFoundException("Employee not found");

        let startDate: Date;
        let endDate: Date;

        if (query.startDate) {
            startDate = new Date(query.startDate);
        } else {
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
        }

        if (query.endDate) {
            endDate = new Date(query.endDate);
        } else {
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 30);
            endDate.setHours(23, 59, 59, 999);
        }

        const schedules = await this.scheduleRepo.findByEmployeeIdAndDateRange({
            employeeId: id,
            startDate,
            endDate
        });

        return schedules.map(s => this.mapScheduleToIso(s));
    }

    async updateSchedule(employeeId: string, scheduleId: string, dto: UpdateScheduleDto) {
        const schedule = await this.scheduleRepo.findById(scheduleId);
        if (!schedule || schedule.employee.id !== employeeId) {
            throw new NotFoundException("Schedule not found for this employee");
        }

        const updatedData: any = {};

        let startCheck = schedule.startTime;
        let endCheck = schedule.endTime;

        if (dto.startTime) {
            updatedData.startTime = new Date(dto.startTime);
            startCheck = updatedData.startTime;
        }

        if (dto.endTime) {
            updatedData.endTime = new Date(dto.endTime);
            endCheck = updatedData.endTime;
        }

        if (dto.startTime || dto.endTime) {
            this.validateScheduleTimes(startCheck, endCheck);

            const hasConflict = await this.scheduleRepo.checkConflict({
                position: schedule.employee.position,
                start: startCheck,
                end: endCheck,
                excludeScheduleId: schedule.id
            });

            if (hasConflict) throw new ConflictException("An employee is already assigned to this position during this time slot");
        }

        const updatedSchedule = await this.scheduleRepo.update(scheduleId, updatedData);
        return this.mapScheduleToIso(updatedSchedule);
    }

    async deleteSchedule(employeeId: string, scheduleId: string) {
        const schedule = await this.scheduleRepo.findById(scheduleId);
        if (!schedule || schedule.employee.id !== employeeId) {
            throw new NotFoundException("Schedule not found for this employee");
        }
        await this.scheduleRepo.delete(scheduleId);
    }

    private mapEmployeeToIso(emp: any) {
        return {
            ...emp,
            createdAt: emp.createdAt ? emp.createdAt.toISOString() : undefined,
            updatedAt: emp.updatedAt ? emp.updatedAt.toISOString() : undefined,
            deletedAt: emp.deletedAt ? emp.deletedAt.toISOString() : null,
        };
    }

    private mapScheduleToIso(schedule: any) {
        return {
            ...schedule,
            startTime: schedule.startTime instanceof Date
                ? schedule.startTime.toISOString()
                : new Date(schedule.startTime).toISOString(),
            endTime: schedule.endTime instanceof Date
                ? schedule.endTime.toISOString()
                : new Date(schedule.endTime).toISOString(),
            createdAt: schedule.createdAt ? schedule.createdAt.toISOString() : undefined,
            updatedAt: schedule.updatedAt ? schedule.updatedAt.toISOString() : undefined,
            deletedAt: schedule.deletedAt ? schedule.deletedAt.toISOString() : null,
        };
    }
}