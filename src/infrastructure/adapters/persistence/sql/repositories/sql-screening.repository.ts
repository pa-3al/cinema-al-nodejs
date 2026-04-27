import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    IRoomConflictFilter,
    IScreeningFilters,
    IScreeningRepositoryPort
} from "src/core/domain/cinema/screening/port/screening-repository.port";
import { getAllResponse } from "src/core/domain/global/types/global.type";
import { LessThan, MoreThan, Not, Repository } from "typeorm";
import { Screening } from "../entities/screening.entity";

@Injectable()
export class SqlScreeningRepository implements IScreeningRepositoryPort {

    constructor(
        @InjectRepository(Screening)
        private readonly screeningRepository: Repository<Screening>
    ) {}

    create(screening: Partial<Screening>): Screening {
        return this.screeningRepository.create(screening);
    }

    async save(screening: Partial<Screening>): Promise<Screening> {
        return await this.screeningRepository.save(screening);
    }

    async findById(id: number): Promise<Screening | null> {
        return await this.screeningRepository.findOne({
            where: { id },
            relations: {
                movie: true,
                room: true,
            },
        });
    }

    async findAll(filters: IScreeningFilters): Promise<getAllResponse<Screening>> {
        const query = this.screeningRepository
            .createQueryBuilder("screening")
            .leftJoinAndSelect("screening.movie", "movie")
            .leftJoinAndSelect("screening.room", "room")
            .where("room.isMaintenance = :isMaintenance", { isMaintenance: false })
            .orderBy("screening.startTime", "ASC");

        if (filters.movieId != null) {
            query.andWhere("movie.id = :movieId", { movieId: filters.movieId });
        }

        if (filters.roomId != null) {
            query.andWhere("room.id = :roomId", { roomId: filters.roomId });
        }

        if (filters.startDate != null) {
            query.andWhere("screening.startTime >= :startDate", { startDate: filters.startDate });
        }

        if (filters.endDate != null) {
            query.andWhere("screening.startTime <= :endDate", { endDate: filters.endDate });
        }

        query.skip((filters.page - 1) * filters.size);
        query.take(filters.size);

        const [screenings, totalCount] = await query.getManyAndCount();

        return {
            data: screenings,
            page: filters.page,
            size: filters.size,
            totalCount,
            totalPage: Math.ceil(totalCount / filters.size)
        };
    }

    async update(id: number, screening: Partial<Screening>): Promise<Screening | null> {
        const screeningFind = await this.findById(id);
        if (!screeningFind) return null;

        if (screening.movie !== undefined) screeningFind.movie = screening.movie;
        if (screening.room !== undefined) screeningFind.room = screening.room;
        if (screening.startTime !== undefined) screeningFind.startTime = screening.startTime;
        if (screening.endTime !== undefined) screeningFind.endTime = screening.endTime;

        return await this.screeningRepository.save(screeningFind);
    }

    async delete(id: number): Promise<Screening | null> {
        const screening = await this.findById(id);
        if (!screening) return null;

        await this.screeningRepository.softRemove(screening);
        return screening;
    }

    async hasRoomConflict(filter: IRoomConflictFilter): Promise<boolean> {
        const query = this.screeningRepository
            .createQueryBuilder("screening")
            .innerJoin("screening.room", "room")
            .where("room.id = :roomId", { roomId: filter.roomId })
            .andWhere("screening.startTime < :endTime", { endTime: filter.endTime })
            .andWhere("screening.endTime > :startTime", { startTime: filter.startTime });

        if (filter.excludeScreeningId) {
            query.andWhere("screening.id != :excludeId", { excludeId: filter.excludeScreeningId });
        }

        const conflict = await query.getOne();
        return !!conflict;
    }

    async hasMovieConflict(params: { movieId: number, startTime: Date, endTime: Date, excludeScreeningId?: number }): Promise<boolean> {
        const whereClause: any = {
            movie: { id: params.movieId },
            startTime: LessThan(params.endTime),
            endTime: MoreThan(params.startTime),
        };

        if (params.excludeScreeningId) {
            whereClause.id = Not(params.excludeScreeningId);
        }

        const conflict = await this.screeningRepository.findOne({ where: whereClause });
        return !!conflict;
    }

    async findByMovieIdAndDateRange(movieId: number, startDate: Date, endDate: Date): Promise<Screening[]> {
        return await this.screeningRepository
            .createQueryBuilder("screening")
            .leftJoinAndSelect("screening.movie", "movie")
            .leftJoinAndSelect("screening.room", "room")
            .where("movie.id = :movieId", { movieId })
            .andWhere("room.isMaintenance = :isMaintenance", { isMaintenance: false })
            .andWhere("screening.startTime >= :startDate", { startDate })
            .andWhere("screening.startTime <= :endDate", { endDate })
            .orderBy("screening.startTime", "ASC")
            .getMany();
    }
}