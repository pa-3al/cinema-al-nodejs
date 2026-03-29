import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserRepositoryPort } from "src/core/domain/user/port/user-repository.port";

@Injectable()
export class SqlUserRepository implements UserRepositoryPort {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) {}

    async save(user: Partial<User>): Promise<User> {
        return this.repository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repository.createQueryBuilder('user')
            .where('user.email = :email', { email })
            .addSelect('user.password')
            .getOne();
    }

    async findById(id: string): Promise<User | null> {
        return this.repository.findOne({ where: { id } });
    }

    async updateRole(id: string, role: string): Promise<void> {
        await this.repository.update(id, { role });
    }
}