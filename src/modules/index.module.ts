import { Module } from '@nestjs/common';
import { MovieGenreModule } from "./movie-genre/movie-genre.module";
import { ProjectionTypeModule } from "./projection-type/projection-type.module";
import { RoomModule } from './room/room.module';
import { RoomImageModule } from './room-image/room-image.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        MovieGenreModule,
        ProjectionTypeModule,
        RoomModule,
        RoomImageModule,
        AuthModule,
        EmployeeModule,
        UserModule
    ],
})
export class Modules {}