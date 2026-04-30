import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    Logger
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { IdNumberParamDto, PaginationQueryDto } from "../../core/domain/global/dto/global.dto";
import { TICKET_PRICE_SERVICE } from "../../core/domain/global/token";
import * as ticketPriceServicePort from "../../core/domain/cinema/ticket/port/ticket-price-service.port";
import { AllTicketPriceDto, CreateAndUpdateTicketPriceDto, TicketPriceDetailDto } from "../../core/domain/cinema/ticket/dto/ticket-price.dto";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/application/cinema/auth/guards/roles.guard";
import { Roles } from "../../core/application/cinema/auth/decorators/roles.decorator";

@ApiTags("Ticket Prices")
@Controller("ticket-prices")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TicketPriceController {
    private readonly logger = new Logger(TicketPriceController.name);

    constructor(
        @Inject(TICKET_PRICE_SERVICE)
        private readonly ticketPriceService: ticketPriceServicePort.ITicketPriceServicePort,
    ) {}

    @Post()
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: "Create a ticket price" })
    @ApiCreatedResponse({ type: TicketPriceDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid payload data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateTicketPriceDto })
    async create(@Body() body: CreateAndUpdateTicketPriceDto) {
        this.logger.log(`Creating ticket price for projection type ID: ${body.projectionTypeId}`);
        return this.ticketPriceService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get all ticket prices with pagination" })
    @ApiOkResponse({ type: AllTicketPriceDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findAll(@Query() query: PaginationQueryDto) {
        this.logger.log(`Fetching ticket prices with pagination: page ${query.page}, size ${query.size}`);
        return this.ticketPriceService.findAll(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a ticket price by id" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: TicketPriceDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "Ticket price not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findOne(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Fetching ticket price by id: ${idParam.id}`);
        const ticketPrice = await this.ticketPriceService.findOne(idParam);
        if (!ticketPrice) {
            this.logger.warn(`Ticket price with id ${idParam.id} not found`);
            throw new NotFoundException(`Ticket price with id ${idParam.id} not found`);
        }
        return ticketPrice;
    }

    @Patch(":id")
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: "Update a ticket price" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: TicketPriceDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid parameters or payload" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Ticket price not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateTicketPriceDto })
    async update(@Param() idParam: IdNumberParamDto, @Body() body: CreateAndUpdateTicketPriceDto) {
        this.logger.log(`Updating ticket price with id: ${idParam.id}`);
        const ticketPrice = await this.ticketPriceService.update(idParam, body);
        if (!ticketPrice) {
            this.logger.warn(`Failed to update. Ticket price with id ${idParam.id} not found`);
            throw new NotFoundException(`Ticket price with id ${idParam.id} not found`);
        }
        return ticketPrice;
    }

    @Delete(":id")
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: "Soft delete a ticket price" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: TicketPriceDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Ticket price not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async delete(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Deleting ticket price with id: ${idParam.id}`);
        const ticketPrice = await this.ticketPriceService.delete(idParam);
        if (!ticketPrice) {
            this.logger.warn(`Failed to delete. Ticket price with id ${idParam.id} not found`);
            throw new NotFoundException(`Ticket price with id ${idParam.id} not found`);
        }
        return ticketPrice;
    }
}