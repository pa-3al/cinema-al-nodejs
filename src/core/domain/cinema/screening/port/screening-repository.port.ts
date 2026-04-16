import { getAllResponse } from "src/core/domain/global/types/global.type";
import { Screening } from "src/infrastructure/adapters/persistence/sql/entities/screening.entity";

export interface IScreeningFilters {
    page: number;
    size: number;
    movieId?: number;
    roomId?: number;
    startDate?: Date;
    endDate?: Date;
}

export interface IRoomConflictFilter {
    roomId: number;
    startTime: Date;
    endTime: Date;
}

export interface IScreeningRepositoryPort {
    create(screening: Partial<Screening>): Screening;
    save(screening: Partial<Screening>): Promise<Screening>;
    findById(id: number): Promise<Screening | null>;
    findAll(filters: IScreeningFilters): Promise<getAllResponse<Screening>>;
    hasRoomConflict(filter: IRoomConflictFilter): Promise<boolean>;
    findByMovieIdAndDateRange(movieId: number, startDate: Date, endDate: Date): Promise<Screening[]>;
}
