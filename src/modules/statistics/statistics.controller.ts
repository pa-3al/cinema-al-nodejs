import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/application/cinema/auth/guards/roles.guard";
import { Roles } from "../../core/application/cinema/auth/decorators/roles.decorator";
import * as statisticsServicePort from "../../core/domain/cinema/statistics/port/statistics-service.port";
import {STATISTICS_SERVICE} from "../../core/domain/global/token";
import {Inject} from "@nestjs/common";

@ApiTags('Statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('employee', 'super_admin')
@Controller('statistics')
export class StatisticsController {
    constructor(
        @Inject(STATISTICS_SERVICE) private readonly statisticsService: statisticsServicePort.IStatisticsServicePort
    ) {}

    @ApiOperation({ summary: "Get week's statistics" })
    @Get('screenings/:id')
    async getScreeningStats(@Param('id', ParseIntPipe) id: number) {
        return await this.statisticsService.getScreeningStats(id);
    }

    @ApiOperation({ summary: "Get daily statistics" })
    @ApiQuery({ name: 'date', required: false })
    @Get('attendance/daily')
    async getDailyAttendance(@Query('date') dateString?: string) {
        const date = dateString ? new Date(dateString) : new Date();
        return await this.statisticsService.getDailyAttendance(date);
    }

    @ApiOperation({ summary: "Get weekly statistics" })
    @ApiQuery({ name: 'date', required: false })
    @Get('attendance/weekly')
    async getWeeklyAttendance(@Query('date') dateString?: string) {
        const date = dateString ? new Date(dateString) : new Date();
        return await this.statisticsService.getWeeklyAttendance(date);
    }

    @ApiOperation({ summary: "Get specific periods" })
    @Get('attendance/custom')
    async getCustomAttendance(
        @Query('startDate') startDateString: string,
        @Query('endDate') endDateString: string
    ) {
        return await this.statisticsService.getCustomAttendance(new Date(startDateString), new Date(endDateString));
    }
}