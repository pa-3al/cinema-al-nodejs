import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { IUserServicePort } from "../../../domain/user/port/user-service.port";
import { TRANSACTION_REPOSITORY, USER_REPOSITORY } from "../../../domain/global/token";
import * as userRepositoryPort from "../../../domain/user/port/user-repository.port";
import * as transactionRepositoryPort from "../../../domain/user/port/transaction-repository.port";

@Injectable()
export class UserService implements IUserServicePort {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: userRepositoryPort.UserRepositoryPort,
        @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: transactionRepositoryPort.ITransactionRepositoryPort
    ) {}

    async findById(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }

    async deposit(id: string, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Le montant doit être positif');
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
            throw new BadRequestException('Le montant doit être positif');
        }
        const user = await this.findById(id);
        if (user.balance < amount) {
            throw new BadRequestException('Solde insuffisant');
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
}