import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { USER_REPOSITORY, TRANSACTION_REPOSITORY } from '../../../domain/global/token';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
    let service: UserService;

    const mockUserRepository = {
        findById: jest.fn(),
        save: jest.fn(),
        findAll: jest.fn(),
        getUserActivityStats: jest.fn(),
    };

    const mockTransactionRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findByUserId: jest.fn(),
        findAll: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: USER_REPOSITORY, useValue: mockUserRepository },
                { provide: TRANSACTION_REPOSITORY, useValue: mockTransactionRepository },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('deposit', () => {
        it('should throw BadRequestException if amount is negative or zero', async () => {
            await expect(service.deposit('user-id', 0)).rejects.toThrow(BadRequestException);
            await expect(service.deposit('user-id', -10)).rejects.toThrow(BadRequestException);
        });

        it('should increase user balance and create a deposit transaction', async () => {
            const userId = 'uuid-1234';
            const user = { id: userId, balance: 50 };
            const transactionCreated = { type: 'deposit', amount: 25, user };

            mockUserRepository.findById.mockResolvedValue(user);
            mockTransactionRepository.create.mockReturnValue(transactionCreated);
            mockUserRepository.save.mockResolvedValue(undefined);
            mockTransactionRepository.save.mockResolvedValue(undefined);

            const result = await service.deposit(userId, 25);

            expect(user.balance).toEqual(75);
            expect(mockUserRepository.save).toHaveBeenCalledWith(user);
            expect(mockTransactionRepository.create).toHaveBeenCalledWith({ type: 'deposit', amount: 25, user });
            expect(mockTransactionRepository.save).toHaveBeenCalledWith(transactionCreated);
            expect(result.balance).toEqual(75);
        });
    });

    describe('withdraw', () => {
        it('should throw BadRequestException if amount is negative or zero', async () => {
            await expect(service.withdraw('user-id', 0)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if user has not enough balance', async () => {
            const user = { id: 'uuid-1234', balance: 10 };
            mockUserRepository.findById.mockResolvedValue(user);

            await expect(service.withdraw('uuid-1234', 20)).rejects.toThrow(BadRequestException);
        });

        it('should decrease user balance and create a withdrawal transaction', async () => {
            const userId = 'uuid-1234';
            const user = { id: userId, balance: 50 };
            const transactionCreated = { type: 'withdrawal', amount: -20, user };

            mockUserRepository.findById.mockResolvedValue(user);
            mockTransactionRepository.create.mockReturnValue(transactionCreated);

            const result = await service.withdraw(userId, 20);

            expect(user.balance).toEqual(30);
            expect(mockUserRepository.save).toHaveBeenCalledWith(user);
            expect(mockTransactionRepository.create).toHaveBeenCalledWith({ type: 'withdrawal', amount: -20, user });
            expect(result.balance).toEqual(30);
        });
    });
});