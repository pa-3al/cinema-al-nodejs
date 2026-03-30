import { Body, Controller, Get, Param, Post, Patch, Delete, Req, UseGuards, SetMetadata, Inject, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CreateEmployeeDto, CreateScheduleDto, EmployeeQueryDto, ScheduleQueryDto, UpdateEmployeeDto, UpdateScheduleDto } from "../../core/domain/employee/dto/employee.dto";
import * as employeeServicePort from "../../core/domain/employee/port/employee-service.port";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/application/cinema/auth/guards/roles.guard";
import { EMPLOYEE_SERVICE } from "../../core/domain/global/token";
import { IdUuidParamDto } from "../../core/domain/global/dto/global.dto";
import express from "express";

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags("Employees")
@Controller("employees")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeeController {
    constructor(
        @Inject(EMPLOYEE_SERVICE) private readonly employeeService: employeeServicePort.IEmployeeServicePort
    ) {}

    @Get("me/schedules")
    @Roles("employee", "super_admin")
    @ApiOperation({summary: "Get my schedules (Employee)"})
    async getMySchedules(@Req() req: express.Request) {
        const userId = (req as any).user.id;
        return this.employeeService.getSchedulesByUserId(userId);
    }

    @Get()
    @Roles("super_admin")
    @ApiOperation({ summary: "Get all employees" })
    async getAllEmployees(@Query() query: EmployeeQueryDto) {
        return this.employeeService.findAllEmployees(query);
    }

    @Get(":id")
    @Roles("super_admin")
    @ApiOperation({ summary: "Get employee by id" })
    async getEmployeeById(@Param() param: IdUuidParamDto) {
        return this.employeeService.findEmployeeById(param.id);
    }

    @Patch(":id")
    @Roles("super_admin")
    @ApiOperation({ summary: "Update employee" })
    async updateEmployee(@Param() param: IdUuidParamDto, @Body() body: UpdateEmployeeDto) {
        return this.employeeService.updateEmployee(param.id, body);
    }

    @Get(":id/schedules")
    @Roles("super_admin", "employee")
    @ApiOperation({ summary: "Get employee schedules" })
    async getEmployeeSchedules(@Param() param: IdUuidParamDto, @Query() query: ScheduleQueryDto) {
        return this.employeeService.getEmployeeSchedules(param.id, query);
    }

    @Post()
    @Roles("super_admin")
    @ApiOperation({ summary: "Assign employee role to a user (Super Admin)" })
    async createEmployee(@Body() body: CreateEmployeeDto) {
        return this.employeeService.createEmployee(body);
    }

    @Post(":id/schedules")
    @Roles("super_admin")
    @ApiOperation({ summary: "Create a schedule for an employee (Super Admin)" })
    async createSchedule(@Param() param: IdUuidParamDto, @Body() body: CreateScheduleDto) {
        return this.employeeService.createSchedule(param.id, body);
    }

    @Patch(":id/schedules/:scheduleId")
    @Roles("super_admin")
    @ApiOperation({ summary: "Update a schedule" })
    async updateSchedule(@Param("id") id: string, @Param("scheduleId") scheduleId: string, @Body() body: UpdateScheduleDto) {
        return this.employeeService.updateSchedule(id, scheduleId, body);
    }

    @Delete(":id/schedules/:scheduleId")
    @Roles("super_admin")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Delete a schedule" })
    async deleteSchedule(@Param("id") id: string, @Param("scheduleId") scheduleId: string) {
        return this.employeeService.deleteSchedule(id, scheduleId);
    }
}