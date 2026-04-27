import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IStatisticsServicePort } from "../../../domain/cinema/statistics/port/statistics-service.port";
import { STATISTICS_REPOSITORY } from "../../../domain/global/token";
import * as statisticsRepositoryPort from "../../../domain/cinema/statistics/port/statistics-repository.port";
import {AttendanceStatsDto, ScreeningStatsDto} from "../../../domain/cinema/statistics/dto/statistics.dto";

@Injectable()
export class StatisticsService implements IStatisticsServicePort {
    constructor(
        @Inject(STATISTICS_REPOSITORY)
        private readonly statisticsRepository: statisticsRepositoryPort.IStatisticsRepositoryPort
    ) {}

    async getScreeningStats(screeningId: number): Promise<ScreeningStatsDto> {
        const stats = await this.statisticsRepository.getScreeningStats(screeningId);
        if (!stats) {
            throw new NotFoundException(`Screening with ID ${screeningId} not found`);
        }
        return stats;
    }

    async getDailyAttendance(date: Date): Promise<AttendanceStatsDto> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await this.statisticsRepository.getAttendanceStats(startOfDay, endOfDay);
    }

    async getWeeklyAttendance(date: Date): Promise<AttendanceStatsDto> {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay() || 7;
        if (day !== 1) startOfWeek.setHours(-24 * (day - 1));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return await this.statisticsRepository.getAttendanceStats(startOfWeek, endOfWeek);
    }

    async getCustomAttendance(startDate: Date, endDate: Date): Promise<AttendanceStatsDto> {
        return await this.statisticsRepository.getAttendanceStats(startDate, endDate);
    }
}