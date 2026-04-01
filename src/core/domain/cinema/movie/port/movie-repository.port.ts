import { getAllResponse } from "src/core/domain/global/types/global.type";
import { Movie } from "src/infrastructure/adapters/persistence/sql/entities/movie.entity";

export interface IMovieRepositoryPort {
    create(movie: Partial<Movie>): Movie;
    save(movie: Partial<Movie>): Promise<Movie>;
    findAll({ page, size }: { page: number, size: number }): Promise<getAllResponse<Movie>>;
    findById(id: number): Promise<Movie | null>;
    update(id: number, movie: Partial<Movie>): Promise<Movie | null>;
    delete(id: number): Promise<Movie | null>;
}
