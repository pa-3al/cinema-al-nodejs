import { Inject, Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IAuthServicePort } from "../../../domain/auth/port/auth-service.port";
import { REFRESH_TOKEN_REPOSITORY, USER_REPOSITORY } from "../../../domain/global/token";
import * as userRepositoryPort from "../../../domain/user/port/user-repository.port";
import * as refreshTokenRepositoryPort from "../../../domain/auth/port/refresh-token-repository.port";
import { LoginDto, RegisterDto } from "../../../domain/auth/dto/auth.dto";

@Injectable()
export class AuthService implements IAuthServicePort {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: userRepositoryPort.UserRepositoryPort,
        @Inject(REFRESH_TOKEN_REPOSITORY) private readonly tokenRepository: refreshTokenRepositoryPort.RefreshTokenRepositoryPort
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.userRepository.findByEmail(dto.email);
        if (existing) throw new ConflictException('Email already used');

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        return this.userRepository.save({ ...dto, password: hashedPassword, role: 'user' });
    }

    async login(dto: LoginDto) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Bad Credentials');
        }

        return this.generateTokens(user);
    }

    async refreshToken(refreshToken: string) {
        const storedToken = await this.tokenRepository.findByToken(refreshToken);
        if (!storedToken) throw new UnauthorizedException('Invalid Refresh Token');

        if (new Date() > storedToken.expiredAt) {
            await this.tokenRepository.deleteByToken(refreshToken);
            throw new UnauthorizedException('Refresh Token expired');
        }

        await this.tokenRepository.deleteByToken(refreshToken);
        return this.generateTokens(storedToken.user);
    }

    private async generateTokens(user: any) {
        const payload = { id: user.id, email: user.email, role: user.role };

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'secret', { expiresIn: '5m' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });

        const expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + 7);

        await this.tokenRepository.save({ token: refreshToken, expiredAt, user });

        return { accessToken, refreshToken };
    }

    async logout(userId: string, token: string) {
        await this.tokenRepository.deleteByToken(token);
    }
}