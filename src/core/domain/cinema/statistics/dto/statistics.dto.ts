import { ApiProperty } from "@nestjs/swagger";

export class ScreeningStatsDto {
    @ApiProperty()
    screeningId: number;

    @ApiProperty()
    movieTitle: string;

    @ApiProperty()
    roomName: string;

    @ApiProperty()
    capacity: number;

    @ApiProperty()
    spectators: number;

    @ApiProperty()
    occupancyRate: number;
}

export class AttendanceStatsDto {
    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate: Date;

    @ApiProperty()
    totalSpectators: number;

    @ApiProperty()
    averageOccupancyRate: number;

    @ApiProperty()
    totalScreenings: number;
}