import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { USER_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from '../../../domain/global/token';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let service: AuthService;

    const mockUserRepository = {
        findByEmail: jest.fn(),
        save: jest.fn(),
    };

    const mockTokenRepository = {
        findByToken: jest.fn(),
        deleteByToken: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: USER_REPOSITORY, useValue: mockUserRepository },
                { provide: REFRESH_TOKEN_REPOSITORY, useValue: mockTokenRepository },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should throw ConflictException if email is already used', async () => {
            const dto = { email: 'test@test.com', password: 'password', firstname: 'John', lastname: 'Doe' };
            mockUserRepository.findByEmail.mockResolvedValue({ id: '1' });

            await expect(service.register(dto)).rejects.toThrow(ConflictException);
        });

        it('should hash password and save user', async () => {
            const dto = { email: 'test@test.com', password: 'password', firstname: 'John', lastname: 'Doe' };
            mockUserRepository.findByEmail.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            mockUserRepository.save.mockResolvedValue({ ...dto, id: '1', password: 'hashedPassword', role: 'user' });

            const result = await service.register(dto);

            expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
            expect(mockUserRepository.save).toHaveBeenCalledWith({ ...dto, password: 'hashedPassword', role: 'user' });
            expect(result.id).toEqual('1');
        });
    });

    describe('login', () => {
        it('should throw UnauthorizedException if user not found', async () => {
            const dto = { email: 'test@test.com', password: 'password' };
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password does not match', async () => {
            const dto = { email: 'test@test.com', password: 'wrongpassword' };
            mockUserRepository.findByEmail.mockResolvedValue({ password: 'hashedPassword' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
        });

        it('should generate and return tokens if credentials are valid', async () => {
            const dto = { email: 'test@test.com', password: 'password' };
            const user = { id: 'uuid-1', email: 'test@test.com', role: 'user', password: 'hashedPassword' };

            mockUserRepository.findByEmail.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValueOnce('mockedAccessToken').mockReturnValueOnce('mockedRefreshToken');

            const result = await service.login(dto);

            expect(result).toEqual({ accessToken: 'mockedAccessToken', refreshToken: 'mockedRefreshToken' });
            expect(mockTokenRepository.save).toHaveBeenCalled();
        });
    });

    describe('refreshToken', () => {
        it('should throw UnauthorizedException if token is not found', async () => {
            mockTokenRepository.findByToken.mockResolvedValue(null);
            await expect(service.refreshToken('invalidToken')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException and delete token if expired', async () => {
            const expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() - 1);
            mockTokenRepository.findByToken.mockResolvedValue({ token: 'expiredToken', expiredAt: expiredDate });

            await expect(service.refreshToken('expiredToken')).rejects.toThrow(UnauthorizedException);
            expect(mockTokenRepository.deleteByToken).toHaveBeenCalledWith('expiredToken');
        });
    });

    describe('logout', () => {
        it('should delete the refresh token', async () => {
            await service.logout('uuid-1', 'validToken');
            expect(mockTokenRepository.deleteByToken).toHaveBeenCalledWith('validToken');
        });
    });
});