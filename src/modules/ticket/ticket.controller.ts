import { Body, Controller, Get, Inject, NotFoundException, Param, Post, Query, Req, UseGuards, Logger } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { IdNumberParamDto, PaginationQueryDto } from "../../core/domain/global/dto/global.dto";
import { TICKET_SERVICE } from "../../core/domain/global/token";
import * as ticketServicePort from "../../core/domain/cinema/ticket/port/ticket-service.port";
import { AllTicketDto, CreateTicketDto, TicketDetailDto, UseTicketDto } from "../../core/domain/cinema/ticket/dto/ticket.dto";

@ApiTags("Tickets")
@Controller("tickets")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketController {
    private readonly logger = new Logger(TicketController.name);

    constructor(
        @Inject(TICKET_SERVICE)
        private readonly ticketService: ticketServicePort.ITicketServicePort,
    ) {}

    @Post()
    @ApiOperation({ summary: "Purchase a ticket for the current user" })
    @ApiCreatedResponse({ type: TicketDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Insufficient balance or invalid payload" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateTicketDto })
    async buy(@Req() req: { user: { id: string } }, @Body() body: CreateTicketDto) {
        const userId = req.user.id;
        this.logger.log(`User ${userId} purchasing a ticket of type: ${body.ticketType}`);
        return this.ticketService.buy(userId, body);
    }

    @Get("me")
    @ApiOperation({ summary: "Get the authenticated user's tickets" })
    @ApiOkResponse({ type: AllTicketDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findMyTickets(@Req() req: { user: { id: string } }, @Query() query: PaginationQueryDto) {
        const userId = req.user.id;
        this.logger.log(`Fetching tickets for user: ${userId}`);
        return this.ticketService.findMyTickets(userId, query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get one ticket owned by the authenticated user" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: TicketDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - Ticket does not belong to user" })
    @ApiNotFoundResponse({ description: "Ticket not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findOne(@Req() req: { user: { id: string } }, @Param() idParam: IdNumberParamDto) {
        const userId = req.user.id;
        this.logger.log(`User ${userId} fetching ticket id: ${idParam.id}`);
        const ticket = await this.ticketService.findOne(userId, idParam);
        if (!ticket) {
            this.logger.warn(`Ticket id ${idParam.id} not found for user ${userId}`);
            throw new NotFoundException(`Ticket with id ${idParam.id} not found`);
        }
        return ticket;
    }

    @Post(":id/use")
    @ApiOperation({ summary: "Validate a ticket for a screening" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: TicketDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Ticket has no remaining uses or already used for this screening" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - Ticket does not belong to user" })
    @ApiNotFoundResponse({ description: "Ticket or Screening not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: UseTicketDto })
    async useTicket(@Req() req: { user: { id: string } }, @Param() idParam: IdNumberParamDto, @Body() body: UseTicketDto) {
        const userId = req.user.id;
        this.logger.log(`User ${userId} attempting to use ticket id: ${idParam.id} for screening id: ${body.screeningId}`);
        const ticket = await this.ticketService.useTicket(userId, idParam, body);
        if (!ticket) {
            this.logger.warn(`Failed to use ticket. Ticket id ${idParam.id} not found for user ${userId}`);
            throw new NotFoundException(`Ticket with id ${idParam.id} not found`);
        }
        return ticket;
    }
}