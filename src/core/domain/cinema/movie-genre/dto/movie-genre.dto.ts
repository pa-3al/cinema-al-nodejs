import { ApiProperty } from '@nestjs/swagger';

export class MovieGenreDetailDto {
    @ApiProperty({ description: 'Unique identifier of the genre', example: 1 })
    id: number;

    @ApiProperty({ description: 'Name of the genre', example: 'Action' })
    name: string;

    @ApiProperty({ description: 'Creation timestamp', example: '2026-03-15T12:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2026-03-15T12:30:00.000Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Deletion timestamp, null if not deleted', example: null })
    deletedAt: Date | null;
}

export class AllMovieGenreDto {
    @ApiProperty({ type: [MovieGenreDetailDto], description: 'List of movie genres on this page' })
    data: MovieGenreDetailDto[];

    @ApiProperty({ description: 'Current page number', example: 1 })
    page: number;

    @ApiProperty({ description: 'Number of items per page', example: 10 })
    size: number;

    @ApiProperty({ description: 'Total number of items', example: 120 })
    totalCount: number;

    @ApiProperty({ description: 'Total number of pages', example: 12 })
    totalPage: number;
}

export class CreateAndUpdateMovieGenreDto {
    @ApiProperty({ description: 'Name of the genre', example: 'Comedy' })
    name: string;
}