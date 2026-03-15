import {MovieGenre} from "../../../../../infrastructure/adapters/persistence/sql/entities/movie-genre.entity";
import {getAllResponse} from "../../../global/types/global.type";

export interface IMovieGenreRepository {
    findAll({page, size} : {page : number, size : number}) : Promise<getAllResponse<MovieGenre>>;
    findById(id : number) : Promise<MovieGenre | null>;
    create(movieGenre: Partial<MovieGenre>) : MovieGenre;
    save(movieGenre: MovieGenre) : Promise<MovieGenre>;
    update(id:number, movieGenre: Partial<MovieGenre>) : Promise<MovieGenre | null>;
    delete(id:number) : Promise<MovieGenre | null>;
}