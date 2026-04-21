import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserRepositoryPort } from "src/core/domain/user/port/user-repository.port";
import {UserActivityDto} from "../../../../../core/domain/user/dto/user-activity.dto";

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

    async getUserActivityStats(id: string): Promise<UserActivityDto | null> {
        const user = await this.repository.findOne({
            where: { id },
            relations: [
                'transactions',
                'tickets',
                'tickets.usages',
                'tickets.usages.screening',
                'tickets.usages.screening.movie'
            ]
        });

        if (!user) return null;

        const moviesSeen = new Set<string>();
        let ticketsBought = user.tickets?.length || 0;
        let totalSpent = 0;

        user.transactions?.forEach(t => {
            if (t.type === 'ticket_purchase') {
                totalSpent += Math.abs(t.amount);
            }
        });

        user.tickets?.forEach(ticket => {
            if (ticket.usages) {
                ticket.usages.forEach(usage => {
                    if (usage.screening && usage.screening.movie) {
                        moviesSeen.add(usage.screening.movie.title);
                    }
                });
            }
        });

        return {
            userId: user.id,
            email: user.email,
            balance: user.balance,
            ticketsBought,
            totalSpent,
            moviesSeen: Array.from(moviesSeen)
        };
    }
}