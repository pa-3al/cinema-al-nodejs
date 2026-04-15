import { AllTicketPriceDto, CreateAndUpdateTicketPriceDto, TicketPriceDetailDto } from "../dto/ticket-price.dto";
import { IdNumberParamDto, PaginationQueryDto } from "../../../global/dto/global.dto";

export interface ITicketPriceServicePort {
    create(ticketPrice: CreateAndUpdateTicketPriceDto): Promise<TicketPriceDetailDto>;
    findAll(paginationQuery: PaginationQueryDto): Promise<AllTicketPriceDto>;
    findOne(idParam: IdNumberParamDto): Promise<TicketPriceDetailDto | null>;
    update(idParam: IdNumberParamDto, ticketPrice: CreateAndUpdateTicketPriceDto): Promise<TicketPriceDetailDto | null>;
    delete(idParam: IdNumberParamDto): Promise<TicketPriceDetailDto | null>;
}
