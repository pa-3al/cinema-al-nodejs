import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "../entities/transaction.entity";
import { ITransactionRepositoryPort } from "src/core/domain/user/port/transaction-repository.port";
import {PaginationQueryDto} from "../../../../../core/domain/global/dto/global.dto";
import {getAllResponse} from "../../../../../core/domain/global/types/global.type";

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

    async findAll(pagination: PaginationQueryDto): Promise<getAllResponse<Transaction>> {
        const page = pagination.page || 1;
        const size = pagination.size || 10;

        const [data, totalCount] = await this.repository.findAndCount({
            skip: (page - 1) * size,
            take: size,
            order: { createdAt: 'DESC' },
            relations: ['user']
        });

        return {
            data,
            page,
            size,
            totalCount,
            totalPage: Math.ceil(totalCount / size)
        };
    }
}