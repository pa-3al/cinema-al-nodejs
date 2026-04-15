import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ITicketServicePort } from "../../../domain/cinema/ticket/port/ticket-service.port";
import * as ticketRepositoryPort from "../../../domain/cinema/ticket/port/ticket-repository.port";
import { SCREENING_REPOSITORY, TICKET_REPOSITORY, USER_REPOSITORY } from "../../../domain/global/token";
import * as userRepositoryPort from "../../../domain/user/port/user-repository.port";
import * as screeningRepositoryPort from "../../../domain/cinema/screening/port/screening-repository.port";
import { AllTicketDto, CreateTicketDto, TicketDetailDto, UseTicketDto } from "../../../domain/cinema/ticket/dto/ticket.dto";
import { IdNumberParamDto, PaginationQueryDto } from "../../../domain/global/dto/global.dto";
import { TicketType } from "../../../../infrastructure/adapters/persistence/sql/entities/ticket.entity";
import { Ticket } from "../../../../infrastructure/adapters/persistence/sql/entities/ticket.entity";

@Injectable()
export class TicketService implements ITicketServicePort {

    constructor(
        @Inject(TICKET_REPOSITORY as symbol)
        private readonly ticketRepository: ticketRepositoryPort.ITicketRepositoryPort,
        @Inject(USER_REPOSITORY as symbol)
        private readonly userRepository: userRepositoryPort.UserRepositoryPort,
        @Inject(SCREENING_REPOSITORY as symbol)
        private readonly screeningRepository: screeningRepositoryPort.IScreeningRepositoryPort,
    ) {}

    private toDto(ticket: Ticket): TicketDetailDto {
        const totalUses = ticket.ticketType === TicketType.TEN ? 10 : 1;
        const usages = ticket.usages ?? [];
        const usedCount = usages.length;

        return {
            id: ticket.id,
            ticketType: ticket.ticketType,
            totalUses,
            usedCount,
            remainingUses: Math.max(totalUses - usedCount, 0),
            usages: usages.map((usage) => ({
                screeningId: usage.screening.id,
                usedAt: usage.usedAt,
            })),
        };
    }

    async buy(userId: string, ticket: CreateTicketDto): Promise<TicketDetailDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }

        const saved = await this.ticketRepository.save({
            ticketType: ticket.ticketType,
            user,
        });

        const detailed = await this.ticketRepository.findOneWithUsages(saved.id);

        if (!detailed) {
            throw new NotFoundException(`Ticket with id ${saved.id} not found`);
        }

        return this.toDto(detailed);
    }

    async findMyTickets(userId: string, paginationParam: PaginationQueryDto): Promise<AllTicketDto> {
        let page = 1;
        let size = 10;
        if (paginationParam.page != null) {
            page = paginationParam.page;
        }
        if (paginationParam.size != null) {
            size = paginationParam.size;
        }
        const result = await this.ticketRepository.findUserTickets(userId, { page, size });

        return{
            data: result.data.map((ticket) => this.toDto(ticket)),
            page: result.page,
            size: result.size,
            totalCount: result.totalCount,
            totalPage: result.totalPage,
        };
    }

    async findOne(userId: string, idParam: IdNumberParamDto): Promise<TicketDetailDto | null>
    {
        const ticket = await this.ticketRepository.findOneWithUsages(idParam.id);
        if (!ticket) {
            return null;
        }

        if (ticket.user.id !== userId) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à utiliser ce billet");
        }

        return this.toDto(ticket);
    }

    async useTicket(userId: string, idParam: IdNumberParamDto, dto: UseTicketDto): Promise<TicketDetailDto | null> {
        const ticket = await this.ticketRepository.findOneWithUsages(idParam.id);
        if (!ticket) {
            return null;
        }

        const screening = await this.screeningRepository.findById(dto.screeningId);
        if (!screening) {
            throw new NotFoundException(`Screening with id ${dto.screeningId} not found`);
        }
        const totalUses = ticket.ticketType === TicketType.TEN ? 10 : 1;
        const usages = ticket.usages ?? [];

        if (usages.some((usage) => usage.screening.id === screening.id))
            throw new BadRequestException("This ticket was already used for this screening");

        if (usages.length >= totalUses)
            throw new BadRequestException("This ticket has no remaining uses");

        await this.ticketRepository.saveUsage({
            ticket,
            screening,
            usedAt: new Date(),
        });

        const refreshed = await this.ticketRepository.findOneWithUsages(ticket.id);
        if (!refreshed)
        {
            return null;
        }

        return this.toDto(refreshed);
    }
}
