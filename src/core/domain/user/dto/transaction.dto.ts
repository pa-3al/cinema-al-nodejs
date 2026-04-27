import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class MoneyOperationDto {
    @ApiProperty({ description: "Montant de l'opération", example: 50 })
    @IsNumber()
    @Min(0.01)
    amount: number;
}

export class TransactionDetailDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ description: "Type d'opération", example: "deposit" })
    type: string;

    @ApiProperty({ description: "Montant", example: 50 })
    amount: number;

    @ApiProperty()
    createdAt: Date;
}

export class AllTransactionsDto {
    @ApiProperty({ type: [TransactionDetailDto] })
    data: TransactionDetailDto[];

    @ApiProperty()
    page: number;

    @ApiProperty()
    size: number;

    @ApiProperty()
    totalCount: number;

    @ApiProperty()
    totalPage: number;
}