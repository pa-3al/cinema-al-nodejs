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
    @ApiProperty({
        example: "user-uuid",
        description: "Unique identifier of the user associated with the employee"
    })
    @IsString()
    userId: string;

    @ApiProperty({
        enum: EmployeePosition,
        description: "Position assigned to the employee"
    })
    @IsEnum(EmployeePosition)
    position: EmployeePosition;
}

export class CreateScheduleDto {
    @ApiProperty({
        example: "2026-10-15T09:00:00.000Z",
        description: "Start date and time of the employee's shift (ISO 8601 format)"
    })
    @IsDateString()
    startTime: string;

    @ApiProperty({
        example: "2026-10-15T17:00:00.000Z",
        description: "End date and time of the employee's shift (ISO 8601 format)"
    })
    @IsDateString()
    endTime: string;
}

export class UpdateEmployeeDto {
    @ApiPropertyOptional({
        enum: EmployeePosition,
        description: "Updated position of the employee"
    })
    @IsOptional()
    @IsEnum(EmployeePosition)
    position?: EmployeePosition;
}

export class UpdateScheduleDto {
    @ApiPropertyOptional({
        example: "2026-10-15T09:00:00.000Z",
        description: "Updated start time of the shift (ISO 8601 format)"
    })
    @IsOptional()
    @IsDateString()
    startTime?: string;

    @ApiPropertyOptional({
        example: "2026-10-15T17:00:00.000Z",
        description: "Updated end time of the shift (ISO 8601 format)"
    })
    @IsOptional()
    @IsDateString()
    endTime?: string;
}

export class EmployeeQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        enum: EmployeePosition,
        description: "Filter employees by position"
    })
    @IsOptional()
    @IsEnum(EmployeePosition)
    position?: string;

    @ApiPropertyOptional({
        example: true,
        description: "Filter to return only employees currently working"
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isWorkingNow?: boolean;
}

export class ScheduleQueryDto {
    @ApiPropertyOptional({
        example: "2026-10-01T00:00:00.000Z",
        description: "Filter schedules starting from this date (ISO 8601 format)"
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({
        example: "2026-10-31T23:59:59.999Z",
        description: "Filter schedules up to this date (ISO 8601 format)"
    })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}