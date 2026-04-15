import { AllTicketDto, CreateTicketDto, TicketDetailDto, UseTicketDto } from "../dto/ticket.dto";
import { IdNumberParamDto, PaginationQueryDto } from "../../../global/dto/global.dto";

export interface ITicketServicePort {
    buy(userId: string, ticket: CreateTicketDto): Promise<TicketDetailDto>;
    findMyTickets(userId: string, paginationQuery: PaginationQueryDto): Promise<AllTicketDto>;
    findOne(userId: string, idParam: IdNumberParamDto): Promise<TicketDetailDto | null>;
    useTicket(userId: string, idParam: IdNumberParamDto, dto: UseTicketDto): Promise<TicketDetailDto | null>;
}
