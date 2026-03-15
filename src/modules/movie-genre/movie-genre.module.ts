import {TypeOrmModule} from "@nestjs/typeorm";
import {MovieGenreController} from "./movie-genre.controller";
import {MovieGenre} from "../../infrastructure/adapters/persistence/sql/entities/movie-genre.entity";
import {Module} from "@nestjs/common";
import {MOVIE_GENRE_REPOSITORY, MOVIE_GENRE_SERVICE} from "../../core/domain/global/token";
import {MovieGenreService} from "../../core/application/cinema/movie-genre/movie-genre.service";
import {
    SqlMovieGenreRepository
} from "../../infrastructure/adapters/persistence/sql/repositories/sql-movie-genre.repository";


@Module({
    imports: [TypeOrmModule.forFeature([MovieGenre])],
    controllers: [MovieGenreController],
    providers : [
        {provide : MOVIE_GENRE_SERVICE, useClass: MovieGenreService},
        { provide: MOVIE_GENRE_REPOSITORY, useClass: SqlMovieGenreRepository },
    ],
    exports : [MOVIE_GENRE_SERVICE]
})
export class MovieGenreModule {}