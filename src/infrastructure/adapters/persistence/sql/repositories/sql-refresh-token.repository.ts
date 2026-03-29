import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RefreshToken } from "../entities/refresh-tokens.entity";
import { RefreshTokenRepositoryPort } from "src/core/domain/auth/port/refresh-token-repository.port";

@Injectable()
export class SqlRefreshTokenRepository implements RefreshTokenRepositoryPort {
    constructor(
        @InjectRepository(RefreshToken)
        private readonly repository: Repository<RefreshToken>
    ) {}

    async save(token: Partial<RefreshToken>): Promise<RefreshToken> {
        return this.repository.save(token);
    }

    async findByToken(token: string): Promise<RefreshToken | null> {
        return this.repository.findOne({ where: { token }, relations: ['user'] });
    }

    async deleteByToken(token: string): Promise<void> {
        await this.repository.delete({ token });
    }

    async deleteAllForUser(userId: string): Promise<void> {
        await this.repository.delete({ user: { id: userId } });
    }
}