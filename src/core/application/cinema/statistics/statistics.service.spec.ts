import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from './statistics.service';
import { STATISTICS_REPOSITORY } from '../../../domain/global/token';
import { NotFoundException } from '@nestjs/common';

describe('StatisticsService', () => {
    let service: StatisticsService;

    const mockStatisticsRepository = {
        getScreeningStats: jest.fn(),
        getAttendanceStats: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StatisticsService,
                { provide: STATISTICS_REPOSITORY, useValue: mockStatisticsRepository },
            ],
        }).compile();

        service = module.get<StatisticsService>(StatisticsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getScreeningStats', () => {
        it('should return screening stats if found', async () => {
            const expectedStats = { totalAttendees: 50, revenue: 500 };
            mockStatisticsRepository.getScreeningStats.mockResolvedValue(expectedStats);

            const result = await service.getScreeningStats(1);

            expect(mockStatisticsRepository.getScreeningStats).toHaveBeenCalledWith(1);
            expect(result).toEqual(expectedStats);
        });

        it('should throw NotFoundException if screening stats not found', async () => {
            mockStatisticsRepository.getScreeningStats.mockResolvedValue(null);

            await expect(service.getScreeningStats(99)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getDailyAttendance', () => {
        it('should return attendance stats for a specific day', async () => {
            const date = new Date('2026-04-28T12:00:00Z');
            const expectedStats = { totalAttendees: 150 };
            mockStatisticsRepository.getAttendanceStats.mockResolvedValue(expectedStats);

            const result = await service.getDailyAttendance(date);

            const expectedStart = new Date(date);
            expectedStart.setHours(0, 0, 0, 0);
            const expectedEnd = new Date(date);
            expectedEnd.setHours(23, 59, 59, 999);

            expect(mockStatisticsRepository.getAttendanceStats).toHaveBeenCalledWith(expectedStart, expectedEnd);
            expect(result).toEqual(expectedStats);
        });
    });

    describe('getWeeklyAttendance', () => {
        it('should return attendance stats for the week', async () => {
            const date = new Date('2026-04-28T12:00:00Z');
            const expectedStats = { totalAttendees: 1050 };
            mockStatisticsRepository.getAttendanceStats.mockResolvedValue(expectedStats);

            const result = await service.getWeeklyAttendance(date);

            expect(mockStatisticsRepository.getAttendanceStats).toHaveBeenCalled();
            expect(result).toEqual(expectedStats);
        });
    });

    describe('getCustomAttendance', () => {
        it('should return attendance stats between two dates', async () => {
            const startDate = new Date('2026-04-01T00:00:00Z');
            const endDate = new Date('2026-04-30T23:59:59Z');
            const expectedStats = { totalAttendees: 5000 };
            mockStatisticsRepository.getAttendanceStats.mockResolvedValue(expectedStats);

            const result = await service.getCustomAttendance(startDate, endDate);

            expect(mockStatisticsRepository.getAttendanceStats).toHaveBeenCalledWith(startDate, endDate);
            expect(result).toEqual(expectedStats);
        });
    });
});