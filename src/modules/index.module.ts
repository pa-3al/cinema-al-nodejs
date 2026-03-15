import { Module } from '@nestjs/common';
import {MovieGenreModule} from "./movie-genre/movie-genre.module";

@Module({
    imports: [
        MovieGenreModule
    ],
})
export class Modules {}