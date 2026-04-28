import { Module } from '@nestjs/common';
import { MovieGenreModule } from "./movie-genre/movie-genre.module";
import { ProjectionTypeModule } from "./projection-type/projection-type.module";
import { RoomModule } from './room/room.module';
import { RoomImageModule } from './room-image/room-image.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { ScreeningModule } from './screening/screening.module';
import {MonitoringModule} from "./monitoring/monitoring.module";
import {StatisticsModule} from "./statistics/statistics.module";
import {TicketModule} from "./ticket/ticket.module";

@Module({
    imports: [
        MovieGenreModule,
        ProjectionTypeModule,
        RoomModule,
        RoomImageModule,
        AuthModule,
        EmployeeModule,
        UserModule,
        MovieModule,
        ScreeningModule,
        MonitoringModule,
        StatisticsModule,
        TicketModule
    ],
})
export class Modules {}
