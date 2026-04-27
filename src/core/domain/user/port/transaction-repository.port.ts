import { Transaction } from "../../../../infrastructure/adapters/persistence/sql/entities/transaction.entity";
import {PaginationQueryDto} from "../../global/dto/global.dto";
import {getAllResponse} from "../../global/types/global.type";

export interface ITransactionRepositoryPort {
    create(transaction: Partial<Transaction>): Transaction;
    save(transaction: Transaction): Promise<Transaction>;
    findByUserId(userId: string): Promise<Transaction[]>;
    findAll(pagination: PaginationQueryDto): Promise<getAllResponse<Transaction>>;
}