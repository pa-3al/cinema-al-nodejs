import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MovieController } from "./movie.controller";
import { Movie } from "src/infrastructure/adapters/persistence/sql/entities/movie.entity";
import { Screening } from "src/infrastructure/adapters/persistence/sql/entities/screening.entity";
import { MovieService } from "src/core/application/cinema/movie/movie.service";
import {MOVIE_REPOSITORY, MOVIE_SERVICE, SCREENING_REPOSITORY, STORAGE_PORT} from "src/core/domain/global/token";
import { SqlMovieRepository } from "src/infrastructure/adapters/persistence/sql/repositories/sql-movie.repository";
import { SqlScreeningRepository } from "src/infrastructure/adapters/persistence/sql/repositories/sql-screening.repository";
import {MinioService} from "../../infrastructure/adapters/external/minio.service";

@Module({
    imports: [TypeOrmModule.forFeature([Movie, Screening])],
    controllers: [MovieController],
    providers: [
        { provide: MOVIE_SERVICE, useClass: MovieService },
        { provide: MOVIE_REPOSITORY, useClass: SqlMovieRepository },
        { provide: SCREENING_REPOSITORY, useClass: SqlScreeningRepository },
        { provide: STORAGE_PORT, useClass: MinioService}
    ],
    exports: [MOVIE_SERVICE]
})
export class MovieModule {}
