import { AttendanceStatsDto, ScreeningStatsDto } from "../dto/statistics.dto";

export interface IStatisticsRepositoryPort {
    getScreeningStats(screeningId: number): Promise<ScreeningStatsDto | null>;
    getAttendanceStats(startDate: Date, endDate: Date): Promise<AttendanceStatsDto>;
}