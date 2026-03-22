import { Module } from '@nestjs/common';
import {MovieGenreModule} from "./movie-genre/movie-genre.module";
import {ProjectionTypeModule} from "./projection-type/projection-type.module";

@Module({
    imports: [
        MovieGenreModule,
        ProjectionTypeModule
    ],
})
export class Modules {}
