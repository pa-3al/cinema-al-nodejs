import { Controller, Get, Param, ParseIntPipe, Query, UseGuards, Inject, Logger } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiOkResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/application/cinema/auth/guards/roles.guard";
import { Roles } from "../../core/application/cinema/auth/decorators/roles.decorator";
import * as statisticsServicePort from "../../core/domain/cinema/statistics/port/statistics-service.port";
import { STATISTICS_SERVICE } from "../../core/domain/global/token";

@ApiTags('Statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('employee', 'super_admin')
@Controller('statistics')
export class StatisticsController {
    private readonly logger = new Logger(StatisticsController.name);

    constructor(
        @Inject(STATISTICS_SERVICE) private readonly statisticsService: statisticsServicePort.IStatisticsServicePort
    ) {}

    @ApiOperation({ summary: "Get week's statistics" })
    @ApiOkResponse({ description: "Successfully retrieved screening stats" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Screening not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @Get('screenings/:id')
    async getScreeningStats(@Param('id', ParseIntPipe) id: number) {
        this.logger.log(`Fetching statistics for screening id: ${id}`);
        return await this.statisticsService.getScreeningStats(id);
    }

    @ApiOperation({ summary: "Get daily statistics" })
    @ApiQuery({ name: 'date', required: false })
    @ApiOkResponse({ description: "Successfully retrieved daily attendance" })
    @ApiBadRequestResponse({ description: "Bad request" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @Get('attendance/daily')
    async getDailyAttendance(@Query('date') dateString?: string) {
        const date = dateString ? new Date(dateString) : new Date();
        this.logger.log(`Fetching daily attendance for date: ${date.toISOString()}`);
        return await this.statisticsService.getDailyAttendance(date);
    }

    @ApiOperation({ summary: "Get weekly statistics" })
    @ApiQuery({ name: 'date', required: false })
    @ApiOkResponse({ description: "Successfully retrieved weekly attendance" })
    @ApiBadRequestResponse({ description: "Bad request" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @Get('attendance/weekly')
    async getWeeklyAttendance(@Query('date') dateString?: string) {
        const date = dateString ? new Date(dateString) : new Date();
        this.logger.log(`Fetching weekly attendance for date: ${date.toISOString()}`);
        return await this.statisticsService.getWeeklyAttendance(date);
    }

    @ApiOperation({ summary: "Get specific periods" })
    @ApiOkResponse({ description: "Successfully retrieved custom attendance" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @Get('attendance/custom')
    async getCustomAttendance(
        @Query('startDate') startDateString: string,
        @Query('endDate') endDateString: string
    ) {
        this.logger.log(`Fetching custom attendance between ${startDateString} and ${endDateString}`);
        return await this.statisticsService.getCustomAttendance(new Date(startDateString), new Date(endDateString));
    }
}