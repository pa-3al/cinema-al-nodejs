import {AllMovieGenreDto, CreateAndUpdateMovieGenreDto, MovieGenreDetailDto} from "../dto/movie-genre.dto";
import {IdNumberParamDto, PaginationQueryDto} from "../../../global/dto/global.dto";

export interface IMovieGenreServicePort {
    create(movieGenre : CreateAndUpdateMovieGenreDto) : Promise<MovieGenreDetailDto>;
    findAll(paginationQuery : PaginationQueryDto) : Promise<AllMovieGenreDto>;
    findOnd(idParam : IdNumberParamDto) : Promise<MovieGenreDetailDto | null>;
    update(idParam : IdNumberParamDto, movieGenre : CreateAndUpdateMovieGenreDto) : Promise<MovieGenreDetailDto | null>;
    delete(idParam : IdNumberParamDto) : Promise<MovieGenreDetailDto | null>;
}