import { ApiProperty } from "@nestjs/swagger";

export class ProjectionTypeDetailDto {
    @ApiProperty({ description: "Unique identifier of the projection type", example: 1 })
    id: number;

    @ApiProperty({ description: "Name of the projection type", example: "IMAX" })
    typeName: string;

    @ApiProperty({ description: "Creation timestamp", example: "2026-03-15T12:00:00.000Z" })
    createdAt: Date;

    @ApiProperty({ description: "Last update timestamp", example: "2026-03-15T12:30:00.000Z" })
    updatedAt: Date;

    @ApiProperty({ description: "Deletion timestamp, null if not deleted", example: null })
    deletedAt: Date | null;
}

export class AllProjectionTypeDto {
    @ApiProperty({ type: [ProjectionTypeDetailDto], description: "List of projection types on this page" })
    data: ProjectionTypeDetailDto[];

    @ApiProperty({ description: "Current page number", example: 1 })
    page: number;

    @ApiProperty({ description: "Number of items per page", example: 10 })
    size: number;

    @ApiProperty({ description: "Total number of items", example: 120 })
    totalCount: number;

    @ApiProperty({ description: "Total number of pages", example: 12 })
    totalPage: number;
}

export class CreateAndUpdateProjectionTypeDto {
    @ApiProperty({ description: "Name of the projection type", example: "IMAX" })
    typeName: string;
}
