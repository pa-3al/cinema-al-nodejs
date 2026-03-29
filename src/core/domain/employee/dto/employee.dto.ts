import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { PaginationQueryDto } from "../../global/dto/global.dto";

export enum EmployeePosition {
    CANDY_STORE = 'candy_store',
    RECEPTION = 'reception',
    PROJECTIONIST = 'projectionist'
}

export class CreateEmployeeDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty({ enum: EmployeePosition })
    @IsEnum(EmployeePosition)
    position: EmployeePosition;
}

export class CreateScheduleDto {
    @ApiProperty({ example: "2026-10-15T09:00:00.000Z" })
    @IsDateString()
    startTime: string;

    @ApiProperty({ example: "2026-10-15T17:00:00.000Z" })
    @IsDateString()
    endTime: string;
}

export class UpdateEmployeeDto {
    @ApiPropertyOptional({ enum: EmployeePosition })
    @IsOptional()
    @IsEnum(EmployeePosition)
    position?: EmployeePosition;
}

export class UpdateScheduleDto {
    @ApiPropertyOptional({ example: "2026-10-15T09:00:00.000Z" })
    @IsOptional()
    @IsDateString()
    startTime?: string;

    @ApiPropertyOptional({ example: "2026-10-15T17:00:00.000Z" })
    @IsOptional()
    @IsDateString()
    endTime?: string;
}

export class EmployeeQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ enum: EmployeePosition })
    @IsOptional()
    @IsEnum(EmployeePosition)
    position?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isWorkingNow?: boolean;
}

export class ScheduleQueryDto {
    @ApiPropertyOptional({ example: "2026-10-01T00:00:00.000Z" })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ example: "2026-10-31T23:59:59.999Z" })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}