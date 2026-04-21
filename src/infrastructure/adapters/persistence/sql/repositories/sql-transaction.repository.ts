import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "../entities/transaction.entity";
import { ITransactionRepositoryPort } from "src/core/domain/user/port/transaction-repository.port";

@Injectable()
export class SqlTransactionRepository implements ITransactionRepositoryPort {
    constructor(
        @InjectRepository(Transaction)
        private readonly repository: Repository<Transaction>
    ) {}

    create(transaction: Partial<Transaction>): Transaction {
        return this.repository.create(transaction);
    }

    async save(transaction: Transaction): Promise<Transaction> {
        return await this.repository.save(transaction);
    }

    async findByUserId(userId: string): Promise<Transaction[]> {
        return await this.repository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
    }
}