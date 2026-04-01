import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IMovieServicePort } from "src/core/domain/cinema/movie/port/movie-service.port";
import { MOVIE_REPOSITORY, SCREENING_REPOSITORY } from "src/core/domain/global/token";
import type { IMovieRepositoryPort } from "src/core/domain/cinema/movie/port/movie-repository.port";
import { IdNumberParamDto, PaginationQueryDto } from "src/core/domain/global/dto/global.dto";
import { AllMovieDto, CreateAndUpdateMovieDto, MovieDetailDto, MoviePlanningDto, MoviePlanningQueryDto } from "src/core/domain/cinema/movie/dto/movie.dto";
import type { IScreeningRepositoryPort } from "src/core/domain/cinema/screening/port/screening-repository.port";
import { ScreeningDetailDto } from "src/core/domain/cinema/screening/dto/screening.dto";
import { Movie } from "src/infrastructure/adapters/persistence/sql/entities/movie.entity";
import { Screening } from "src/infrastructure/adapters/persistence/sql/entities/screening.entity";

@Injectable()
export class MovieService implements IMovieServicePort {

    constructor(
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: IMovieRepositoryPort,
        @Inject(SCREENING_REPOSITORY)
        private readonly screeningRepository: IScreeningRepositoryPort
    ) {}

    private mapMovieToDetailDto(movie: Movie): MovieDetailDto {
        return {
            id: movie.id,
            title: movie.title,
            synopsis: movie.synopsis,
            durationMinutes: movie.durationMinutes,
            releaseDate: movie.releaseDate,
            createdAt: movie.createdAt,
            updatedAt: movie.updatedAt,
            deletedAt: movie.deletedAt
        };
    }

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

    async create(movie: CreateAndUpdateMovieDto): Promise<MovieDetailDto> {
        const movieCreated = this.movieRepository.create({
            title: movie.title,
            synopsis: movie.synopsis,
            durationMinutes: movie.durationMinutes,
            releaseDate: new Date(movie.releaseDate)
        });

        const savedMovie = await this.movieRepository.save(movieCreated);
        return this.mapMovieToDetailDto(savedMovie);
    }

    async findAll(query: PaginationQueryDto): Promise<AllMovieDto> {
        const page = query.page ?? 1;
        const size = query.size ?? 10;

        const movies = await this.movieRepository.findAll({ page, size });

        return {
            data: movies.data.map(movie => this.mapMovieToDetailDto(movie)),
            page: movies.page,
            size: movies.size,
            totalCount: movies.totalCount,
            totalPage: movies.totalPage
        };
    }

    async findOne(idParam: IdNumberParamDto): Promise<MovieDetailDto | null> {
        const movie = await this.movieRepository.findById(idParam.id);

        if (!movie) {
            return null;
        }
        return this.mapMovieToDetailDto(movie);
    }

    async update(idParam: IdNumberParamDto, movie: CreateAndUpdateMovieDto): Promise<MovieDetailDto | null> {
        const updatedMovie = await this.movieRepository.update(idParam.id, {
            title: movie.title,
            synopsis: movie.synopsis,
            durationMinutes: movie.durationMinutes,
            releaseDate: new Date(movie.releaseDate)
        });

        if (!updatedMovie) {
            return null;
        }
        return this.mapMovieToDetailDto(updatedMovie);
    }

    async delete(idParam: IdNumberParamDto): Promise<MovieDetailDto | null> {
        const deletedMovie = await this.movieRepository.delete(idParam.id);

        if (!deletedMovie) {
            return null;
        }
        return this.mapMovieToDetailDto(deletedMovie);
    }

    async getPlanningForNextMonth(idParam: IdNumberParamDto, query: MoviePlanningQueryDto): Promise<MoviePlanningDto | null> {
        const movie = await this.movieRepository.findById(idParam.id);

        if (!movie) {
            return null;
        }

        const startDate = query.startDate ? new Date(query.startDate) : new Date();
        const endDate = query.endDate ? new Date(query.endDate) : new Date(startDate);

        if (!query.endDate) {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        if (Number.isNaN(startDate.getTime())) {
            throw new BadRequestException("Invalid startDate");
        }

        if (Number.isNaN(endDate.getTime())) {
            throw new BadRequestException("Invalid endDate");
        }

        if (startDate >= endDate) {
            throw new BadRequestException("endDate must be strictly after startDate");
        }

        const screenings = await this.screeningRepository.findByMovieIdAndDateRange(
            idParam.id,
            startDate,
            endDate
        );

        return {
            movie: this.mapMovieToDetailDto(movie),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            screenings: screenings.map(screening => this.mapScreeningToDetailDto(screening))
        };
    }
}
