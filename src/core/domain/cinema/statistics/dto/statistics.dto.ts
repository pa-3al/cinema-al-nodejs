import { ApiProperty } from "@nestjs/swagger";

export class ScreeningStatsDto {
    @ApiProperty({
        example: 1,
        description: "Unique identifier of the screening"
    })
    screeningId: number;

    @ApiProperty({
        example: "Absolute Movie",
        description: "Title of the movie shown during the screening"
    })
    movieTitle: string;

    @ApiProperty({
        example: "Absolute Room",
        description: "Name of the room where the screening takes place"
    })
    roomName: string;

    @ApiProperty({
        example: 250,
        description: "Total capacity of the room (maximum number of available seats)"
    })
    capacity: number;

    @ApiProperty({
        example: 150,
        description: "Number of spectators who attended the screening"
    })
    spectators: number;

    @ApiProperty({
        example: 60.0,
        description: "Occupancy rate of the screening as a percentage (spectators / capacity * 100)"
    })
    occupancyRate: number;
}

export class AttendanceStatsDto {
    @ApiProperty({
        example: "2026-04-01T00:00:00Z",
        description: "Start date of the analyzed period"
    })
    startDate: Date;

    @ApiProperty({
        example: "2026-04-30T23:59:59Z",
        description: "End date of the analyzed period"
    })
    endDate: Date;

    @ApiProperty({
        example: 1500,
        description: "Total number of spectators over the period"
    })
    totalSpectators: number;

    @ApiProperty({
        example: 75.5,
        description: "Average occupancy rate over the period (in percentage)"
    })
    averageOccupancyRate: number;

    @ApiProperty({
        example: 20,
        description: "Total number of screenings over the period"
    })
    totalScreenings: number;
}