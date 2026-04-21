import { User } from "../../../../infrastructure/adapters/persistence/sql/entities/user.entity";
import { Transaction } from "../../../../infrastructure/adapters/persistence/sql/entities/transaction.entity";

export interface IUserServicePort {
    findById(id: string): Promise<User>;
    deposit(id: string, amount: number): Promise<User>;
    withdraw(id: string, amount: number): Promise<User>;
    getTransactions(id: string): Promise<Transaction[]>;
}