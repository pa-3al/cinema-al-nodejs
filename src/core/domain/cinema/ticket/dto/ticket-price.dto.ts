import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNumber, Min } from "class-validator";

export class TicketPriceDetailDto {

    @ApiProperty({ description: "Unique identifier of the ticket price", example: 1 })
    id: number;

    @ApiProperty({ description: "Ticket price amount", example: 12.5 })
    price: number;

    @ApiProperty({ description: "Price start date", example: "2026-04-01T00:00:00.000Z" })
    startActivity: Date;

    @ApiProperty({ description: "Price end date", example: "2026-06-30T23:59:59.999Z" })
    endActivity: Date;

    @ApiProperty({ description: "Related projection type identifier", example: 1 })
    projectionTypeId: number;
}

export class AllTicketPriceDto {

    @ApiProperty({ type: [TicketPriceDetailDto], description: "List of ticket prices on this page" })
    data: TicketPriceDetailDto[];

    @ApiProperty({ description: "Current page number", example: 1 })
    page: number;

    @ApiProperty({ description: "Number of items per page", example: 10 })
    size: number;

    @ApiProperty({ description: "Total number of items", example: 25 })
    totalCount: number;

    @ApiProperty({ description: "Total number of pages", example: 3 })
    totalPage: number;
}

export class CreateAndUpdateTicketPriceDto {

    @ApiProperty({ description: "Ticket price amount", example: 12.5 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ description: "Price start date (ISO 8601)", example: "2026-04-01T00:00:00.000Z" })
    @IsDateString()
    startActivity: string;

    @ApiProperty({ description: "Price end date (ISO 8601)", example: "2026-06-30T23:59:59.999Z" })
    @IsDateString()
    endActivity: string;

    @ApiProperty({ description: "Projection type identifier", example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    projectionTypeId: number;
}
