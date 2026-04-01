import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScreeningController } from "./screening.controller";
import { ScreeningService } from "src/core/application/cinema/screening/screening.service";
import { Movie } from "src/infrastructure/adapters/persistence/sql/entities/movie.entity";
import { Room } from "src/infrastructure/adapters/persistence/sql/entities/room.entity";
import { Screening } from "src/infrastructure/adapters/persistence/sql/entities/screening.entity";
import { SqlMovieRepository } from "src/infrastructure/adapters/persistence/sql/repositories/sql-movie.repository";
import { SqlRoomRepository } from "src/infrastructure/adapters/persistence/sql/repositories/sql-room.repository";
import { SqlScreeningRepository } from "src/infrastructure/adapters/persistence/sql/repositories/sql-screening.repository";
import { MOVIE_REPOSITORY, ROOM_REPOSITORY, SCREENING_REPOSITORY, SCREENING_SERVICE } from "src/core/domain/global/token";

@Module({
    imports: [TypeOrmModule.forFeature([Screening, Movie, Room])],
    controllers: [ScreeningController],
    providers: [
        { provide: SCREENING_SERVICE, useClass: ScreeningService },
        { provide: SCREENING_REPOSITORY, useClass: SqlScreeningRepository },
        { provide: MOVIE_REPOSITORY, useClass: SqlMovieRepository },
        { provide: ROOM_REPOSITORY, useClass: SqlRoomRepository }
    ],
    exports: [SCREENING_SERVICE]
})
export class ScreeningModule {}
