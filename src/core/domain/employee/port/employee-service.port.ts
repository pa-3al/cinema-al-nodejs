import { CreateEmployeeDto, CreateScheduleDto, EmployeeQueryDto, ScheduleQueryDto, UpdateEmployeeDto, UpdateScheduleDto } from "../dto/employee.dto";
import { getAllResponse } from "../../global/types/global.type";

export interface IEmployeeServicePort {
    createEmployee(dto: CreateEmployeeDto): Promise<any>;
    createSchedule(employeeId: string, dto: CreateScheduleDto): Promise<any>;
    getSchedulesByUserId(userId: string): Promise<any[]>;
    findAllEmployees(query: EmployeeQueryDto): Promise<getAllResponse<any>>;
    findEmployeeById(id: string): Promise<any>;
    updateEmployee(id: string, dto: UpdateEmployeeDto): Promise<any>;
    getEmployeeSchedules(id: string, query: ScheduleQueryDto): Promise<any[]>;
    updateSchedule(employeeId: string, scheduleId: string, dto: UpdateScheduleDto): Promise<any>;
    deleteSchedule(employeeId: string, scheduleId: string): Promise<void>;
}