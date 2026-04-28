import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IMovieRepositoryPort } from "src/core/domain/cinema/movie/port/movie-repository.port";
import { getAllResponse } from "src/core/domain/global/types/global.type";
import { Repository } from "typeorm";
import { Movie } from "../entities/movie.entity";

@Injectable()
export class SqlMovieRepository implements IMovieRepositoryPort {

    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>
    ) {}

    create(movie: Partial<Movie>): Movie {
        return this.movieRepository.create(movie);
    }

    async save(movie: Partial<Movie>): Promise<Movie> {
        return await this.movieRepository.save(movie);
    }

    async findAll({ page, size }: { page: number; size: number; }): Promise<getAllResponse<Movie>> {
        const [movies, totalCount] = await this.movieRepository.findAndCount({
            relations: ['genre'],
            skip: (page - 1) * size,
            take: size,
        });

        return {
            data: movies,
            size,
            page,
            totalCount,
            totalPage: Math.ceil(totalCount / size)
        };
    }

    async findById(id: number): Promise<Movie | null> {
        return await this.movieRepository.findOne({
            where: { id },
            relations: ['genre'] // Inclut la table movie-genre
        });
    }

    async update(id: number, movie: Partial<Movie>): Promise<Movie | null> {
        const movieFound = await this.movieRepository.findOne({
            where: { id },
            relations: ['genre']
        });

        if (!movieFound) {
            return null;
        }

        if (movie.title != null) movieFound.title = movie.title;
        if (movie.synopsis != null) movieFound.synopsis = movie.synopsis;
        if (movie.durationMinutes != null) movieFound.durationMinutes = movie.durationMinutes;
        if (movie.releaseDate != null) movieFound.releaseDate = movie.releaseDate;

        // Mise à jour du genre si fourni
        if (movie.genre !== undefined) {
            movieFound.genre = movie.genre;
        }

        if (movie.posterUrl !== undefined) {
            movieFound.posterUrl = movie.posterUrl;
        }

        return await this.movieRepository.save(movieFound);
    }

    async delete(id: number): Promise<Movie | null> {
        const movie = await this.movieRepository.findOne({
            where: { id },
            relations: ['genre']
        });

        if (!movie) {
            return null;
        }

        await this.movieRepository.softRemove(movie);
        return movie;
    }
}