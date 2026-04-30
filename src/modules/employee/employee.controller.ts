import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Patch,
    Delete,
    Req,
    UseGuards,
    Inject,
    Query,
    HttpCode,
    HttpStatus,
    Logger
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse
} from "@nestjs/swagger";
import {
    CreateEmployeeDto,
    CreateScheduleDto,
    EmployeeQueryDto,
    ScheduleQueryDto,
    UpdateEmployeeDto,
    UpdateScheduleDto
} from "../../core/domain/employee/dto/employee.dto";
import * as employeeServicePort from "../../core/domain/employee/port/employee-service.port";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/application/cinema/auth/guards/roles.guard";
import { EMPLOYEE_SERVICE } from "../../core/domain/global/token";
import { IdUuidParamDto } from "../../core/domain/global/dto/global.dto";
import express from "express";
import { Roles } from "../../core/application/cinema/auth/decorators/roles.decorator";

@ApiTags("Employees")
@Controller("employees")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeeController {
    private readonly logger = new Logger(EmployeeController.name);

    constructor(
        @Inject(EMPLOYEE_SERVICE) private readonly employeeService: employeeServicePort.IEmployeeServicePort
    ) {}

    @Get("me/schedules")
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: "Get my schedules (Employee)" })
    @ApiOkResponse({ description: "Successfully retrieved employee schedules" })
    @ApiBadRequestResponse({ description: "Bad request" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async getMySchedules(@Req() req: express.Request) {
        const userId = (req as any).user.id;
        this.logger.log(`Fetching schedules for authenticated user: ${userId}`);
        return this.employeeService.getSchedulesByUserId(userId);
    }

    @Get()
    @Roles("super_admin")
    @ApiOperation({ summary: "Get all employees" })
    @ApiOkResponse({ description: "Successfully retrieved all employees" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async getAllEmployees(@Query() query: EmployeeQueryDto) {
        this.logger.log(`Fetching all employees with filters: ${JSON.stringify(query)}`);
        return this.employeeService.findAllEmployees(query);
    }

    @Get(":id")
    @Roles("super_admin")
    @ApiOperation({ summary: "Get employee by id" })
    @ApiOkResponse({ description: "Successfully retrieved the employee" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Employee not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async getEmployeeById(@Param() param: IdUuidParamDto) {
        this.logger.log(`Fetching employee by id: ${param.id}`);
        return this.employeeService.findEmployeeById(param.id);
    }

    @Patch(":id")
    @Roles("super_admin")
    @ApiOperation({ summary: "Update employee" })
    @ApiOkResponse({ description: "Successfully updated the employee" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid parameters or payload" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Employee not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async updateEmployee(@Param() param: IdUuidParamDto, @Body() body: UpdateEmployeeDto) {
        this.logger.log(`Updating employee with id: ${param.id}`);
        return this.employeeService.updateEmployee(param.id, body);
    }

    @Get(":id/schedules")
    @Roles("super_admin", "employee")
    @ApiOperation({ summary: "Get employee schedules" })
    @ApiOkResponse({ description: "Successfully retrieved the schedules for the employee" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Employee not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async getEmployeeSchedules(@Param() param: IdUuidParamDto, @Query() query: ScheduleQueryDto) {
        this.logger.log(`Fetching schedules for employee id: ${param.id}`);
        return this.employeeService.getEmployeeSchedules(param.id, query);
    }

    @Post()
    @Roles("super_admin")
    @ApiOperation({ summary: "Assign employee role to a user (Super Admin)" })
    @ApiOkResponse({ description: "Successfully created an employee" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid payload data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async createEmployee(@Body() body: CreateEmployeeDto) {
        this.logger.log(`Creating employee role for user ID: ${body.userId}`);
        return this.employeeService.createEmployee(body);
    }

    @Post(":id/schedules")
    @Roles("super_admin")
    @ApiOperation({ summary: "Create a schedule for an employee (Super Admin)" })
    @ApiOkResponse({ description: "Successfully created schedule" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid schedule limits or conflict" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Employee not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async createSchedule(@Param() param: IdUuidParamDto, @Body() body: CreateScheduleDto) {
        this.logger.log(`Creating schedule for employee id: ${param.id}`);
        return this.employeeService.createSchedule(param.id, body);
    }

    @Patch(":id/schedules/:scheduleId")
    @Roles("super_admin")
    @ApiOperation({ summary: "Update a schedule" })
    @ApiOkResponse({ description: "Successfully updated schedule" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid schedule limits or conflict" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Schedule or Employee not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async updateSchedule(@Param("id") id: string, @Param("scheduleId") scheduleId: string, @Body() body: UpdateScheduleDto) {
        this.logger.log(`Updating schedule id: ${scheduleId} for employee id: ${id}`);
        return this.employeeService.updateSchedule(id, scheduleId, body);
    }

    @Delete(":id/schedules/:scheduleId")
    @Roles("super_admin")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Delete a schedule" })
    @ApiOkResponse({ description: "Successfully deleted schedule" })
    @ApiBadRequestResponse({ description: "Bad request" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Schedule or Employee not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async deleteSchedule(@Param("id") id: string, @Param("scheduleId") scheduleId: string) {
        this.logger.log(`Deleting schedule id: ${scheduleId} for employee id: ${id}`);
        return this.employeeService.deleteSchedule(id, scheduleId);
    }
}