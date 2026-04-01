import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { ScreeningDetailDto } from "../../screening/dto/screening.dto";

export class MovieDetailDto {

    @ApiProperty({ description: "Unique identifier of the movie", example: 1 })
    id: number;

    @ApiProperty({ description: "Movie title", example: "Interstellar" })
    title: string;

    @ApiProperty({ description: "Movie synopsis", example: "A team travels through a wormhole in space..." })
    synopsis: string;

    @ApiProperty({ description: "Movie duration in minutes", example: 169 })
    durationMinutes: number;

    @ApiProperty({ description: "Movie release date", example: "2014-11-05" })
    releaseDate: Date;

    @ApiProperty({ description: "Creation timestamp" })
    createdAt: Date;

    @ApiProperty({ description: "Last update timestamp" })
    updatedAt: Date;

    @ApiProperty({ description: "Deletion timestamp", nullable: true })
    deletedAt: Date | null;
}

export class AllMovieDto {

    @ApiProperty({ description: "List of movies on this page", type: [MovieDetailDto] })
    data: MovieDetailDto[];

    @ApiProperty({ description: "Current page", example: 1 })
    page: number;

    @ApiProperty({ description: "Number of items per page", example: 10 })
    size: number;

    @ApiProperty({ description: "Total number of items", example: 42 })
    totalCount: number;

    @ApiProperty({ description: "Total number of pages", example: 5 })
    totalPage: number;
}

export class CreateAndUpdateMovieDto {

    @ApiProperty({ description: "Movie title", example: "Interstellar" })
    @IsString()
    @MaxLength(255)
    title: string;

    @ApiProperty({ description: "Movie synopsis", example: "A team travels through a wormhole in space..." })
    @IsString()
    synopsis: string;

    @ApiProperty({ description: "Movie duration in minutes", example: 169 })
    @IsInt()
    @Min(1)
    durationMinutes: number;

    @ApiProperty({ description: "Movie release date (ISO 8601)", example: "2014-11-05" })
    @IsDateString()
    releaseDate: string;
}

export class MoviePlanningQueryDto {

    @ApiPropertyOptional({ description: "Range start (ISO 8601). Defaults to now.", example: "2026-04-01T00:00:00.000Z" })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: "Range end (ISO 8601). Defaults to +1 month.", example: "2026-05-01T00:00:00.000Z" })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}

export class MoviePlanningDto {

    @ApiProperty({ description: "Movie details", type: MovieDetailDto })
    movie: MovieDetailDto;

    @ApiProperty({ description: "Planning range start", example: "2026-04-01T00:00:00.000Z" })
    startDate: string;

    @ApiProperty({ description: "Planning range end", example: "2026-05-01T00:00:00.000Z" })
    endDate: string;

    @ApiProperty({ description: "Upcoming screenings for this movie", type: [ScreeningDetailDto] })
    screenings: ScreeningDetailDto[];
}
