import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsInt, IsOptional, Min } from "class-validator";
import { PaginationQueryDto } from "src/core/domain/global/dto/global.dto";

export class ScreeningDetailDto {

    @ApiProperty({ description: "Unique screening identifier", example: 1 })
    id: number;

    @ApiProperty({ description: "Related movie identifier", example: 1 })
    movieId: number;

    @ApiProperty({ description: "Related room identifier", example: 2 })
    roomId: number;

    @ApiProperty({ description: "Movie title", example: "Interstellar" })
    movieTitle: string;

    @ApiProperty({ description: "Room name", example: "Room 2" })
    roomName: string;

    @ApiProperty({ description: "Screening start time", example: "2026-04-03T19:30:00.000Z" })
    startTime: Date;

    @ApiProperty({ description: "Screening end time", example: "2026-04-03T22:19:00.000Z" })
    endTime: Date;

    @ApiProperty({ description: "Creation timestamp" })
    createdAt: Date;

    @ApiProperty({ description: "Last update timestamp" })
    updatedAt: Date;

    @ApiProperty({ description: "Deletion timestamp", nullable: true })
    deletedAt: Date | null;
}

export class AllScreeningDto {

    @ApiProperty({ type: [ScreeningDetailDto], description: "List of screenings on this page" })
    data: ScreeningDetailDto[];

    @ApiProperty({ description: "Current page", example: 1 })
    page: number;

    @ApiProperty({ description: "Items per page", example: 10 })
    size: number;

    @ApiProperty({ description: "Total items count", example: 83 })
    totalCount: number;

    @ApiProperty({ description: "Total pages", example: 9 })
    totalPage: number;
}

export class CreateScreeningDto {

    @ApiProperty({ description: "Movie id", example: 1 })
    @IsInt()
    @Min(1)
    movieId: number;

    @ApiProperty({ description: "Room id", example: 2 })
    @IsInt()
    @Min(1)
    roomId: number;

    @ApiProperty({ description: "Start time (ISO 8601)", example: "2026-04-03T19:30:00.000Z" })
    @IsDateString()
    startTime: string;
}

export class ScreeningQueryDto extends PaginationQueryDto {

    @ApiPropertyOptional({ description: "Filter by movie id", example: 1 })
    @IsOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsInt()
    @Min(1)
    movieId?: number;

    @ApiPropertyOptional({ description: "Filter by room id", example: 2 })
    @IsOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsInt()
    @Min(1)
    roomId?: number;

    @ApiPropertyOptional({ description: "Filter from date (ISO 8601)", example: "2026-04-01T00:00:00.000Z" })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: "Filter to date (ISO 8601)", example: "2026-04-30T23:59:59.999Z" })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}
