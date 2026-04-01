import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IScreeningServicePort } from "src/core/domain/cinema/screening/port/screening-service.port";
import { MOVIE_REPOSITORY, ROOM_REPOSITORY, SCREENING_REPOSITORY } from "src/core/domain/global/token";
import type { IScreeningRepositoryPort } from "src/core/domain/cinema/screening/port/screening-repository.port";
import type { IMovieRepositoryPort } from "src/core/domain/cinema/movie/port/movie-repository.port";
import type { IRoomRepositoryPort } from "src/core/domain/cinema/room/port/room-repository.port";
import { AllScreeningDto, CreateScreeningDto, ScreeningDetailDto, ScreeningQueryDto } from "src/core/domain/cinema/screening/dto/screening.dto";
import { Screening } from "src/infrastructure/adapters/persistence/sql/entities/screening.entity";
import { Movie } from "src/infrastructure/adapters/persistence/sql/entities/movie.entity";
import { Room } from "src/infrastructure/adapters/persistence/sql/entities/room.entity";

@Injectable()
export class ScreeningService implements IScreeningServicePort {
    private readonly CLEANING_BUFFER_MINUTES = 30;
    private readonly OPENING_START_MINUTES = 9 * 60;
    private readonly OPENING_END_MINUTES = 20 * 60;

    constructor(
        @Inject(SCREENING_REPOSITORY)
        private readonly screeningRepository: IScreeningRepositoryPort,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: IMovieRepositoryPort,
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository: IRoomRepositoryPort
    ) {}

    private mapScreeningToDetailDto(screening: Screening): ScreeningDetailDto {
        return {
            id: screening.id,
            movieId: screening.movie.id,
            roomId: screening.room.id,
            movieTitle: screening.movie.title,
            roomName: screening.room.name,
            startTime: screening.startTime,
            endTime: screening.endTime,
            createdAt: screening.createdAt,
            updatedAt: screening.updatedAt,
            deletedAt: screening.deletedAt
        };
    }

    private buildEndTime(startDate: Date, movie: Movie): Date {
        if (movie.durationMinutes <= 0) {
            throw new BadRequestException("Movie duration must be strictly positive");
        }
        const totalMinutes = movie.durationMinutes + this.CLEANING_BUFFER_MINUTES;
        return new Date(startDate.getTime() + totalMinutes * 60 * 1000);
    }

    private ensureRoomIsAvailable(room: Room): void {
        if (room.isMaintenance) {
            throw new BadRequestException("The selected room is currently in maintenance");
        }
    }

    private validateDateValue(date: Date): void {
        if (Number.isNaN(date.getTime())) {
            throw new BadRequestException("Invalid startTime");
        }
    }

    private validateOpeningHours(startTime: Date, endTime: Date): void {
        const isSameDay =
            startTime.getFullYear() === endTime.getFullYear() &&
            startTime.getMonth() === endTime.getMonth() &&
            startTime.getDate() === endTime.getDate();

        if (!isSameDay) {
            throw new BadRequestException("A screening must start and end on the same day");
        }

        const dayOfWeek = startTime.getDay();
        if (dayOfWeek < 1 || dayOfWeek > 5) {
            throw new BadRequestException("Screenings are allowed only from Monday to Friday");
        }

        const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
        const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

        if (startMinutes < this.OPENING_START_MINUTES || endMinutes > this.OPENING_END_MINUTES) {
            throw new BadRequestException("Screenings must be between 09:00 and 20:00");
        }
    }

    async create(screening: CreateScreeningDto): Promise<ScreeningDetailDto> {
        const movie = await this.movieRepository.findById(screening.movieId);
        if (!movie) {
            throw new NotFoundException("Movie not found");
        }

        const room = await this.roomRepository.findById(screening.roomId);
        if (!room) {
            throw new NotFoundException("Room not found");
        }
        this.ensureRoomIsAvailable(room);

        const startTime = new Date(screening.startTime);
        this.validateDateValue(startTime);
        const endTime = this.buildEndTime(startTime, movie);
        this.validateOpeningHours(startTime, endTime);

        const hasConflict = await this.screeningRepository.hasRoomConflict({
            roomId: room.id,
            startTime,
            endTime
        });

        if (hasConflict) {
            throw new ConflictException("A screening already exists in this room for the selected time slot");
        }

        const screeningCreated = this.screeningRepository.create({
            movie,
            room,
            startTime,
            endTime
        });

        const screeningSaved = await this.screeningRepository.save(screeningCreated);
        return this.mapScreeningToDetailDto(screeningSaved);
    }

    async findAll(query: ScreeningQueryDto): Promise<AllScreeningDto> {
        const page = query.page ?? 1;
        const size = query.size ?? 10;

        const startDate = query.startDate ? new Date(query.startDate) : undefined;
        const endDate = query.endDate ? new Date(query.endDate) : undefined;

        if (startDate && Number.isNaN(startDate.getTime())) {
            throw new BadRequestException("Invalid startDate");
        }

        if (endDate && Number.isNaN(endDate.getTime())) {
            throw new BadRequestException("Invalid endDate");
        }

        if (startDate && endDate && startDate > endDate) {
            throw new BadRequestException("endDate must be after startDate");
        }

        const screenings = await this.screeningRepository.findAll({
            page,
            size,
            movieId: query.movieId,
            roomId: query.roomId,
            startDate,
            endDate
        });

        return {
            data: screenings.data.map(screening => this.mapScreeningToDetailDto(screening)),
            page: screenings.page,
            size: screenings.size,
            totalCount: screenings.totalCount,
            totalPage: screenings.totalPage
        };
    }
}
