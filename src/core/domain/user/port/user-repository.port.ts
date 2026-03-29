import { User } from "src/infrastructure/adapters/persistence/sql/entities/user.entity";

export interface UserRepositoryPort {
    save(user: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updateRole(id: string, role: string): Promise<void>;
}