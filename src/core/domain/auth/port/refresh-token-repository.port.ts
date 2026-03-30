import { RefreshToken } from "src/infrastructure/adapters/persistence/sql/entities/refresh-tokens.entity";

export interface RefreshTokenRepositoryPort {
    save(token: Partial<RefreshToken>): Promise<RefreshToken>;
    findByToken(token: string): Promise<RefreshToken | null>;
    deleteByToken(token: string): Promise<void>;
    deleteAllForUser(userId: string): Promise<void>;
}