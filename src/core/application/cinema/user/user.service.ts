import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { IUserServicePort } from "../../../domain/user/port/user-service.port";
import { TRANSACTION_REPOSITORY, USER_REPOSITORY } from "../../../domain/global/token";
import * as userRepositoryPort from "../../../domain/user/port/user-repository.port";
import * as transactionRepositoryPort from "../../../domain/user/port/transaction-repository.port";
import {UserActivityDto} from "../../../domain/user/dto/user-activity.dto";
import {PaginationQueryDto} from "../../../domain/global/dto/global.dto";
import {AllUsersDto} from "../../../domain/user/dto/user.dto";
import {AllTransactionsDto} from "../../../domain/user/dto/transaction.dto";

@Injectable()
export class UserService implements IUserServicePort {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: userRepositoryPort.UserRepositoryPort,
        @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: transactionRepositoryPort.ITransactionRepositoryPort
    ) {}

    async findById(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async deposit(id: string, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }
        const user = await this.findById(id);
        user.balance += amount;
        await this.userRepository.save(user);

        const transaction = this.transactionRepository.create({
            type: 'deposit',
            amount: amount,
            user: user
        });
        await this.transactionRepository.save(transaction);

        return user;
    }

    async withdraw(id: string, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }
        const user = await this.findById(id);
        if (user.balance < amount) {
            throw new BadRequestException('Not enough balance');
        }
        user.balance -= amount;
        await this.userRepository.save(user);

        const transaction = this.transactionRepository.create({
            type: 'withdrawal',
            amount: -amount,
            user: user
        });
        await this.transactionRepository.save(transaction);

        return user;
    }

    async getTransactions(id: string) {
        const user = await this.findById(id);
        return this.transactionRepository.findByUserId(user.id);
    }

    async getUserActivity(id: string): Promise<UserActivityDto> {
        const stats = await this.userRepository.getUserActivityStats(id);
        if (!stats) {
            throw new NotFoundException('User not found');
        }
        return stats;
    }

    async findAllUsers(pagination: PaginationQueryDto): Promise<AllUsersDto> {
        const result = await this.userRepository.findAll(pagination);
        return {
            data: result.data.map(u => ({
                id: u.id,
                email: u.email,
                firstname: u.firstname,
                lastname: u.lastname,
                role: u.role,
                balance: u.balance,
                createdAt: u.createdAt
            })),
            page: result.page,
            size: result.size,
            totalCount: result.totalCount,
            totalPage: result.totalPage
        };
    }

    async getAllTransactions(pagination: PaginationQueryDto): Promise<AllTransactionsDto> {
        const result = await this.transactionRepository.findAll(pagination);
        return {
            data: result.data.map(t => ({
                id: t.id,
                type: t.type,
                amount: t.amount,
                createdAt: t.createdAt
            })),
            page: result.page,
            size: result.size,
            totalCount: result.totalCount,
            totalPage: result.totalPage
        };
    }
}