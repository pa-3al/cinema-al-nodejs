import { Body, Controller, Get, Inject, NotFoundException, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { IdNumberParamDto, PaginationQueryDto } from "../../core/domain/global/dto/global.dto";
import { TICKET_SERVICE } from "../../core/domain/global/token";
import * as ticketServicePort from "../../core/domain/cinema/ticket/port/ticket-service.port";
import { AllTicketDto, CreateTicketDto, TicketDetailDto, UseTicketDto } from "../../core/domain/cinema/ticket/dto/ticket.dto";

@ApiTags("Tickets")
@Controller("tickets")
export class TicketController {

    constructor(
        @Inject(TICKET_SERVICE)
        private readonly ticketService: ticketServicePort.ITicketServicePort,
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Purchase a ticket for the current user" })
    @ApiCreatedResponse({ type: TicketDetailDto })
    @ApiBody({ type: CreateTicketDto })
    async buy(@Req() req: { user: { id: string } }, @Body() body: CreateTicketDto) {
        const userId = req.user.id;
        return this.ticketService.buy(userId, body);
    }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get the authenticated user's tickets" })
    @ApiOkResponse({ type: AllTicketDto })
    async findMyTickets(@Req() req: { user: { id: string } }, @Query() query: PaginationQueryDto) {
        const userId = req.user.id;
        return this.ticketService.findMyTickets(userId, query);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get one ticket owned by the authenticated user" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: TicketDetailDto })
    async findOne(@Req() req: { user: { id: string } }, @Param() idParam: IdNumberParamDto) {
        const userId = req.user.id;
        const ticket = await this.ticketService.findOne(userId, idParam);
        if (!ticket) {
            throw new NotFoundException(`Ticket with id ${idParam.id} not found`);
        }
        return ticket;
    }

    @Post(":id/use")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Validate a ticket for a screening" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: TicketDetailDto })
    @ApiBody({ type: UseTicketDto })
    async useTicket(@Req() req: { user: { id: string } }, @Param() idParam: IdNumberParamDto, @Body() body: UseTicketDto) {
        const userId = req.user.id;
        const ticket = await this.ticketService.useTicket(userId, idParam, body);
        if (!ticket) {
            throw new NotFoundException(`Ticket with id ${idParam.id} not found`);
        }
        return ticket;
    }
}
