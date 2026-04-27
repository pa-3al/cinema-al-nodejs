import { AttendanceStatsDto, ScreeningStatsDto } from "../dto/statistics.dto";

export interface IStatisticsServicePort {
    getScreeningStats(screeningId: number): Promise<ScreeningStatsDto>;
    getDailyAttendance(date: Date): Promise<AttendanceStatsDto>;
    getWeeklyAttendance(date: Date): Promise<AttendanceStatsDto>;
    getCustomAttendance(startDate: Date, endDate: Date): Promise<AttendanceStatsDto>;
}