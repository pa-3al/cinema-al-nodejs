import { Module } from '@nestjs/common';
import {MovieGenreModule} from "./movie-genre/movie-genre.module";
import {ProjectionTypeModule} from "./projection-type/projection-type.module";
import { RoomModule } from './room/room.module';
import { RoomImageModule } from './room-image/room-image.module';

@Module({
    imports: [
        MovieGenreModule,
        ProjectionTypeModule,
        RoomModule,
        RoomImageModule
    ],
})
export class Modules {}
