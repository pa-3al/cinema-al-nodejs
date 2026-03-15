import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Page size', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    size?: number = 10;
}

export class IdNumberParamDto {
    @ApiProperty({ description: 'numeric id of the entity', example: 123 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    id: number;
}

export class IdUuidParamDto {
    @ApiProperty({ description: 'uuid of the entity', example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID()
    id: string;
}