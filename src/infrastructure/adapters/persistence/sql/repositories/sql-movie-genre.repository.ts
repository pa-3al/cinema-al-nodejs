import {Injectable} from "@nestjs/common";
import {IMovieGenreRepository} from "../../../../../core/domain/cinema/movie-genre/port/movie-genre-repository.port";
import {MovieGenre} from "../entities/movie-genre.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";


@Injectable()
export class SqlMovieGenreRepository implements IMovieGenreRepository {

    constructor(
        @InjectRepository(MovieGenre)
        private readonly movieGenreRepository : Repository<MovieGenre>,
    ){}

    async findAll({page, size} : {page : number, size : number}) {
        const query = this.movieGenreRepository.createQueryBuilder()
        query.skip((page - 1) * size)
        query.take(size)

        const [movieGenres, totalCount] = await query.getManyAndCount();
        return {
            data: movieGenres,
            size: size,
            page,
            totalCount,
            totalPage: Math.ceil(totalCount / size)
        }
    }

    async findById(id: number) : Promise<MovieGenre | null> {
        console.log(id)
        return await this.movieGenreRepository.findOneBy({
            id:id
        })
    }

    create(movieGenre: Partial<MovieGenre>) : MovieGenre {
        return this.movieGenreRepository.create(movieGenre)
    }

    async save(movieGenre: Partial<MovieGenre>) : Promise<MovieGenre> {
        return this.movieGenreRepository.save(movieGenre)
    }

    async update(id:number, movieGenre: Partial<MovieGenre>) : Promise<MovieGenre | null> {

        const movieGenreFind = await this.movieGenreRepository.findOneBy({
            id:id
        })

        if (movieGenreFind === null) {
            return null;
        }

        if (movieGenre.name != null) {
            movieGenreFind.name = movieGenre.name
        }

        return await this.movieGenreRepository.save(movieGenreFind)
    }

    async delete(id:number) : Promise<MovieGenre | null> {
        const movieGenre = await this.movieGenreRepository.findOneBy({
            id:id
        })

        if (movieGenre === null) {
            return null;
        }

        await this.movieGenreRepository.softRemove(movieGenre)

        return movieGenre;
    }


}