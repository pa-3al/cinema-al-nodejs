import { Transaction } from "../../../../infrastructure/adapters/persistence/sql/entities/transaction.entity";

export interface ITransactionRepositoryPort {
    create(transaction: Partial<Transaction>): Transaction;
    save(transaction: Transaction): Promise<Transaction>;
    findByUserId(userId: string): Promise<Transaction[]>;
}