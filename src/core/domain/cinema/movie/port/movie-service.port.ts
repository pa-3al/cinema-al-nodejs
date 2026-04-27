import { IdNumberParamDto, PaginationQueryDto } from "src/core/domain/global/dto/global.dto";
import { AllMovieDto, CreateAndUpdateMovieDto, MovieDetailDto, MoviePlanningDto, MoviePlanningQueryDto } from "../dto/movie.dto";

export interface IMovieServicePort {
    create(movie: CreateAndUpdateMovieDto, file?: { originalname: string; buffer: Buffer }): Promise<MovieDetailDto>;    findAll(query: PaginationQueryDto): Promise<AllMovieDto>;
    findOne(idParam: IdNumberParamDto): Promise<MovieDetailDto | null>;
    update(idParam: IdNumberParamDto, movie: CreateAndUpdateMovieDto, file?: { originalname: string; buffer: Buffer }): Promise<MovieDetailDto | null>;    delete(idParam: IdNumberParamDto): Promise<MovieDetailDto | null>;
    getPlanningForNextMonth(idParam: IdNumberParamDto, query: MoviePlanningQueryDto): Promise<MoviePlanningDto | null>;
}
