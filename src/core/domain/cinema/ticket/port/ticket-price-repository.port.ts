import { TicketPrice } from "../../../../../infrastructure/adapters/persistence/sql/entities/ticket-price.entity";
import { getAllResponse } from "../../../global/types/global.type";

export interface ITicketPriceRepositoryPort {
    findAll({ page, size }: { page: number; size: number }): Promise<getAllResponse<TicketPrice>>;
    findById(id: number): Promise<TicketPrice | null>;
    create(ticketPrice: Partial<TicketPrice>): TicketPrice;
    save(ticketPrice: Partial<TicketPrice>): Promise<TicketPrice>;
    update(id: number, ticketPrice: Partial<TicketPrice>): Promise<TicketPrice | null>;
    delete(id: number): Promise<TicketPrice | null>;
}
