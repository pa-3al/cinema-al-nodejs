import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITicketRepositoryPort } from "../../../../../core/domain/cinema/ticket/port/ticket-repository.port";
import { Ticket } from "../entities/ticket.entity";
import { TicketUsage } from "../entities/ticket-usage.entity";
import { Repository } from "typeorm";
import {User} from "../entities/user.entity";
import {Transaction} from "../entities/transaction.entity";
import {Screening} from "../entities/screening.entity";

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

    async buyTicketAtomic(userId: string, ticketType: string, price: number): Promise<Ticket> {
        return await this.ticketRepository.manager.transaction("READ COMMITTED", async (manager) => {
            const user = await manager.createQueryBuilder(User, "user")
                .setLock("pessimistic_write")
                .where("user.id = :userId", { userId })
                .getOne();

            if (!user) throw new NotFoundException("User not found");

            if (user.balance < price) {
                throw new BadRequestException("Solde insuffisant pour acheter ce billet");
            }

            user.balance -= price;
            await manager.save(user);

            const transaction = manager.create(Transaction, {
                type: 'ticket_purchase',
                amount: -price,
                user: user
            });
            await manager.save(transaction);

            const ticket = manager.create(Ticket, {
                ticketType: ticketType as any,
                user: user
            });
            return await manager.save(ticket);
        });
    }

    async useTicketAtomic(ticketId: number, screeningId: number, totalUsesAllowed: number): Promise<TicketUsage> {
        return await this.ticketRepository.manager.transaction("READ COMMITTED", async (manager) => {
            const screening = await manager.createQueryBuilder(Screening, "screening")
                .leftJoinAndSelect("screening.room", "room")
                .setLock("pessimistic_write")
                .where("screening.id = :screeningId", { screeningId })
                .getOne();

            if (!screening) throw new NotFoundException("Screening not found");

            const currentUsages = await manager.createQueryBuilder(TicketUsage, "usage")
                .where("usage.screening_id = :screeningId", { screeningId })
                .getCount();

            if (currentUsages >= screening.room.capacity) {
                throw new BadRequestException("La salle est pleine pour cette séance");
            }

            const ticket = await manager.createQueryBuilder(Ticket, "ticket")
                .setLock("pessimistic_write")
                .where("ticket.id = :ticketId", { ticketId })
                .getOne();

            if (!ticket) throw new NotFoundException("Ticket not found");

            const ticketUsagesCount = await manager.createQueryBuilder(TicketUsage, "usage")
                .where("usage.ticket_id = :ticketId", { ticketId })
                .getCount();

            if (ticketUsagesCount >= totalUsesAllowed) {
                throw new BadRequestException("This ticket has no remaining uses");
            }

            const alreadyUsed = await manager.createQueryBuilder(TicketUsage, "usage")
                .where("usage.ticket_id = :ticketId", { ticketId })
                .andWhere("usage.screening_id = :screeningId", { screeningId })
                .getOne();

            if (alreadyUsed) {
                throw new BadRequestException("This ticket was already used for this screening");
            }

            const newUsage = manager.create(TicketUsage, {
                ticket: ticket,
                screening: screening,
                usedAt: new Date(),
            });

            return await manager.save(newUsage);
        });
    }
}
