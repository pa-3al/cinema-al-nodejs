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
} from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { IdNumberParamDto, PaginationQueryDto } from "../../core/domain/global/dto/global.dto";
import { TICKET_PRICE_SERVICE } from "../../core/domain/global/token";
import * as ticketPriceServicePort from "../../core/domain/cinema/ticket/port/ticket-price-service.port";
import { AllTicketPriceDto, CreateAndUpdateTicketPriceDto, TicketPriceDetailDto } from "../../core/domain/cinema/ticket/dto/ticket-price.dto";

@ApiTags("Ticket Prices")
@Controller("ticket-prices")
export class TicketPriceController {

    constructor(
        @Inject(TICKET_PRICE_SERVICE)
        private readonly ticketPriceService: ticketPriceServicePort.ITicketPriceServicePort,
    ) {}

    @Post()
    @ApiOperation({ summary: "Create a ticket price" })
    @ApiCreatedResponse({ type: TicketPriceDetailDto })
    @ApiBody({ type: CreateAndUpdateTicketPriceDto })
    async create(@Body() body: CreateAndUpdateTicketPriceDto) {
        return this.ticketPriceService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get all ticket prices with pagination" })
    @ApiOkResponse({ type: AllTicketPriceDto })
    async findAll(@Query() query: PaginationQueryDto) {
        return this.ticketPriceService.findAll(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a ticket price by id" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: TicketPriceDetailDto })
    async findOne(@Param() idParam: IdNumberParamDto) {
        const ticketPrice = await this.ticketPriceService.findOne(idParam);
        if (!ticketPrice) {
            throw new NotFoundException(`Ticket price with id ${idParam.id} not found`);
        }
        return ticketPrice;
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update a ticket price" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: TicketPriceDetailDto })
    @ApiBody({ type: CreateAndUpdateTicketPriceDto })
    async update(@Param() idParam: IdNumberParamDto, @Body() body: CreateAndUpdateTicketPriceDto) {
        const ticketPrice = await this.ticketPriceService.update(idParam, body);
        if (!ticketPrice) {
            throw new NotFoundException(`Ticket price with id ${idParam.id} not found`);
        }
        return ticketPrice;
    }

    @Delete(":id")
    @ApiOperation({ summary: "Soft delete a ticket price" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: TicketPriceDetailDto })
    async delete(@Param() idParam: IdNumberParamDto) {
        const ticketPrice = await this.ticketPriceService.delete(idParam);
        if (!ticketPrice) {
            throw new NotFoundException(`Ticket price with id ${idParam.id} not found`);
        }
        return ticketPrice;
    }
}
