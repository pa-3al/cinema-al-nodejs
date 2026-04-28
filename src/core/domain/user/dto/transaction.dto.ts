import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class MoneyOperationDto {
    @ApiProperty({
        example: 50.0,
        description: "Amount of money involved in the operation (must be greater than 0)"
    })
    @IsNumber()
    @Min(0.01)
    amount: number;
}

export class TransactionDetailDto {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Unique identifier of the transaction"
    })
    id: string;

    @ApiProperty({
        example: "deposit",
        description: "Type of transaction (e.g., deposit, withdrawal)"
    })
    type: string;

    @ApiProperty({
        example: 50.0,
        description: "Amount of money involved in the transaction"
    })
    amount: number;

    @ApiProperty({
        example: "2026-04-28T12:00:00Z",
        description: "Date and time when the transaction was created"
    })
    createdAt: Date;
}

export class AllTransactionsDto {
    @ApiProperty({
        type: [TransactionDetailDto],
        description: "List of transactions for the current page"
    })
    data: TransactionDetailDto[];

    @ApiProperty({
        example: 1,
        description: "Current page number"
    })
    page: number;

    @ApiProperty({
        example: 10,
        description: "Number of items per page"
    })
    size: number;

    @ApiProperty({
        example: 100,
        description: "Total number of transactions"
    })
    totalCount: number;

    @ApiProperty({
        example: 10,
        description: "Total number of pages available"
    })
    totalPage: number;
}