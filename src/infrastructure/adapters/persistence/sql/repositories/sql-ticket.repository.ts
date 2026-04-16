import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITicketRepositoryPort } from "../../../../../core/domain/cinema/ticket/port/ticket-repository.port";
import { Ticket } from "../entities/ticket.entity";
import { TicketUsage } from "../entities/ticket-usage.entity";
import { Repository } from "typeorm";

@Injectable()
export class SqlTicketRepository implements ITicketRepositoryPort {

    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        @InjectRepository(TicketUsage)
        private readonly ticketUsageRepository: Repository<TicketUsage>,
    ) {}

    create(ticket: Partial<Ticket>): Ticket {
        return this.ticketRepository.create(ticket);
    }

    async save(ticket: Partial<Ticket>): Promise<Ticket> {
        return await this.ticketRepository.save(ticket);
    }

    async findOneWithUsages(id: number): Promise<Ticket | null> {
        return await this.ticketRepository.findOne({
            where: { id },
            relations: {
                user: true,
                usages: {
                    screening: true,
                },
            },
            order: {
                usages: {
                    usedAt: "ASC",
                },
            },
        });
    }

    async findUserTickets(userId: string, { page, size }: { page: number; size: number; }) {
        const query = this.ticketRepository
            .createQueryBuilder("ticket")
            .distinct(true)
            .leftJoinAndSelect("ticket.user", "user")
            .leftJoinAndSelect("ticket.usages", "usage")
            .leftJoinAndSelect("usage.screening", "screening")
            .where("user.id = :userId", { userId })
            .orderBy("ticket.createdAt", "DESC")
            .addOrderBy("usage.usedAt", "ASC");

        query.skip((page - 1) * size);
        query.take(size);

        const [tickets, totalCount] = await query.getManyAndCount();

        return {
            data: tickets,
            page,
            size,
            totalCount,
            totalPage: Math.ceil(totalCount / size),
        };
    }

    async saveUsage(usage: Partial<TicketUsage>): Promise<TicketUsage> {
        return await this.ticketUsageRepository.save(usage);
    }
}
