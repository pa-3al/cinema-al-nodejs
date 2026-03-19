import {IMovieGenreServicePort} from "../../../domain/cinema/movie-genre/port/movie-genre-service.port";
import {Inject, Injectable} from "@nestjs/common";
import {MOVIE_GENRE_REPOSITORY} from "../../../domain/global/token";
import * as movieGenreRepositoryPort from "../../../domain/cinema/movie-genre/port/movie-genre-repository.port";
import {
    AllMovieGenreDto,
    CreateAndUpdateMovieGenreDto,
    MovieGenreDetailDto
} from "../../../domain/cinema/movie-genre/dto/movie-genre.dto";
import {IdNumberParamDto, PaginationQueryDto} from "../../../domain/global/dto/global.dto";

@Injectable()
export class MovieGenreService implements IMovieGenreServicePort {

    constructor(
        @Inject(MOVIE_GENRE_REPOSITORY)
        private readonly movieGenreRepository: movieGenreRepositoryPort.IMovieGenreRepository,
    ){}

    async create(movieGenre: CreateAndUpdateMovieGenreDto) : Promise<MovieGenreDetailDto> {
        const movieGenreCreated = this.movieGenreRepository.create(movieGenre);
        return await this.movieGenreRepository.save(movieGenreCreated);
    }

    async findOnd(idParam: IdNumberParamDto) : Promise<MovieGenreDetailDto | null> {
        console.log(idParam.id);
        return await this.movieGenreRepository.findById(idParam.id);
    }

    async findAll(paginationParam : PaginationQueryDto) : Promise<AllMovieGenreDto> {

        let page = 1;
        let size = 10;
        if (paginationParam.page != null ){
            page = paginationParam.page;
        }
        if (paginationParam.size != null && paginationParam.size < 100){
            size = paginationParam.size;
        }

        return await this.movieGenreRepository.findAll({page, size});
    }

    async update(idParam : IdNumberParamDto, movieGenre : CreateAndUpdateMovieGenreDto) : Promise<MovieGenreDetailDto | null> {
        return await this.movieGenreRepository.update(idParam.id, movieGenre);
    }

    async delete(idParam : IdNumberParamDto) : Promise<MovieGenreDetailDto | null> {
        return await this.movieGenreRepository.delete(idParam.id);
    }

}
