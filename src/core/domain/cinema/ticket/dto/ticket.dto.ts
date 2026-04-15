import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, Min } from "class-validator";

export class TicketUsageDetailDto {

    @ApiProperty({ description: "Used screening identifier", example: 42 })
    screeningId: number;

    @ApiProperty({ description: "Usage timestamp", example: "2026-04-03T18:50:00.000Z" })
    usedAt: Date;
}

export class TicketDetailDto {

    @ApiProperty({ description: "Unique identifier of the ticket", example: 1 })
    id: number;

    @ApiProperty({ description: "Ticket type", example: "solo" })
    ticketType: string;

    @ApiProperty({ description: "Total number of uses allowed", example: 1 })
    totalUses: number;

    @ApiProperty({ description: "Already used count", example: 0 })
    usedCount: number;

    @ApiProperty({ description: "Remaining uses count", example: 1 })
    remainingUses: number;

    @ApiProperty({ type: [TicketUsageDetailDto], description: "Usage history for this ticket" })
    usages: TicketUsageDetailDto[];
}

export class AllTicketDto {

    @ApiProperty({ type: [TicketDetailDto], description: "List of tickets on this page" })
    data: TicketDetailDto[];

    @ApiProperty({ description: "Current page number", example: 1 })
    page: number;

    @ApiProperty({ description: "Number of items per page", example: 10 })
    size: number;

    @ApiProperty({ description: "Total number of items", example: 18 })
    totalCount: number;

    @ApiProperty({ description: "Total number of pages", example: 2 })
    totalPage: number;
}

export class CreateTicketDto {

    @ApiProperty({ description: "Ticket type", example: "solo", enum: ["solo", "ten"] })
    @IsIn(["solo", "ten"])
    ticketType: string;
}

export class UseTicketDto {

    @ApiProperty({ description: "Screening identifier to validate access", example: 42 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    screeningId: number;
}
