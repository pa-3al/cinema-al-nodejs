import { Ticket } from "../../../../../infrastructure/adapters/persistence/sql/entities/ticket.entity";
import { TicketUsage } from "../../../../../infrastructure/adapters/persistence/sql/entities/ticket-usage.entity";
import { getAllResponse } from "../../../global/types/global.type";

export interface ITicketRepositoryPort {
    create(ticket: Partial<Ticket>): Ticket;
    save(ticket: Partial<Ticket>): Promise<Ticket>;
    findOneWithUsages(id: number): Promise<Ticket | null>;
    findUserTickets(userId: string, { page, size }: { page: number; size: number }): Promise<getAllResponse<Ticket>>;
    saveUsage(usage: Partial<TicketUsage>): Promise<TicketUsage>;
}
