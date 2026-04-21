import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Screening } from "../entities/screening.entity";
import { IStatisticsRepositoryPort } from "src/core/domain/cinema/statistics/port/statistics-repository.port";
import { AttendanceStatsDto, ScreeningStatsDto } from "src/core/domain/cinema/statistics/dto/statistics.dto";

@Injectable()
export class SqlStatisticsRepository implements IStatisticsRepositoryPort {
    constructor(
        @InjectRepository(Screening)
        private readonly screeningRepository: Repository<Screening>
    ) {}

    async getScreeningStats(screeningId: number): Promise<ScreeningStatsDto | null> {
        const screening = await this.screeningRepository.findOne({
            where: { id: screeningId },
            relations: ['room', 'movie']
        });

        if (!screening) return null;

        const totalSpectators = await this.screeningRepository.manager
            .createQueryBuilder()
            .select('tu.id')
            .from('TicketUsage', 'tu')
            .where('tu.screening.id = :id', { id: screeningId })
            .getCount();

        const occupancyRate = screening.room.capacity > 0
            ? (totalSpectators / screening.room.capacity) * 100
            : 0;

        return {
            screeningId: screening.id,
            movieTitle: screening.movie.title,
            roomName: screening.room.name,
            capacity: screening.room.capacity,
            spectators: totalSpectators,
            occupancyRate: Math.round(occupancyRate * 100) / 100,
        };
    }

    async getAttendanceStats(startDate: Date, endDate: Date): Promise<AttendanceStatsDto> {
        const screenings = await this.screeningRepository.find({
            where: { startTime: Between(startDate, endDate) },
            relations: ['room']
        });

        if (screenings.length === 0) {
            return {
                startDate,
                endDate,
                totalSpectators: 0,
                averageOccupancyRate: 0,
                totalScreenings: 0
            };
        }

        const screeningIds = screenings.map(s => s.id);
        const totalCapacity = screenings.reduce((sum, s) => sum + s.room.capacity, 0);

        const totalSpectators = await this.screeningRepository.manager
            .createQueryBuilder()
            .select('tu.id')
            .from('TicketUsage', 'tu')
            .where('tu.screening.id IN (:...ids)', { ids: screeningIds })
            .getCount();

        const averageOccupancyRate = totalCapacity > 0
            ? (totalSpectators / totalCapacity) * 100
            : 0;

        return {
            startDate,
            endDate,
            totalSpectators,
            averageOccupancyRate: Math.round(averageOccupancyRate * 100) / 100,
            totalScreenings: screenings.length
        };
    }
}