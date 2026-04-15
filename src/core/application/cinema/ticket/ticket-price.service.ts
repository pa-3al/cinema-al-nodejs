import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ITicketPriceServicePort } from "../../../domain/cinema/ticket/port/ticket-price-service.port";
import * as ticketPriceRepositoryPort from "../../../domain/cinema/ticket/port/ticket-price-repository.port";
import { PROJECTION_TYPE_REPOSITORY, TICKET_PRICE_REPOSITORY } from "../../../domain/global/token";
import * as projectionTypeRepositoryPort from "../../../domain/cinema/projection-type/port/projection-type-repository.port";
import { AllTicketPriceDto, CreateAndUpdateTicketPriceDto, TicketPriceDetailDto } from "../../../domain/cinema/ticket/dto/ticket-price.dto";
import { IdNumberParamDto, PaginationQueryDto } from "../../../domain/global/dto/global.dto";

@Injectable()
export class TicketPriceService implements ITicketPriceServicePort {

    constructor(
        @Inject(TICKET_PRICE_REPOSITORY as symbol)
        private readonly ticketPriceRepository: ticketPriceRepositoryPort.ITicketPriceRepositoryPort,
        @Inject(PROJECTION_TYPE_REPOSITORY as symbol)
        private readonly projectionTypeRepository: projectionTypeRepositoryPort.IProjectionTypeRepository,
    ) {}

    async create(ticketPrice: CreateAndUpdateTicketPriceDto): Promise<TicketPriceDetailDto> {
        const projectionType = await this.projectionTypeRepository.findById(ticketPrice.projectionTypeId);
        if (!projectionType) {
            throw new NotFoundException(`Projection type not found`);
        }

        const startActivity = new Date(ticketPrice.startActivity);
        const endActivity = new Date(ticketPrice.endActivity);

        const saved = await this.ticketPriceRepository.save({
            price: ticketPrice.price,
            startActivity,
            endActivity,
            projectionType,
        });

        return {
            id: saved.id,
            price: saved.price,
            startActivity: saved.startActivity,
            endActivity: saved.endActivity,
            projectionTypeId: saved.projectionType?.id,
        };
    }

    async findAll(paginationParam: PaginationQueryDto): Promise<AllTicketPriceDto> {
        let page = 1;
        let size = 10;
        if (paginationParam.page != null) {
            page = paginationParam.page;
        }
        if (paginationParam.size != null) {
            size = paginationParam.size;
        }
        const result = await this.ticketPriceRepository.findAll({ page, size });

        return {
            data: result.data.map((ticketPrice) => ({
                id: ticketPrice.id,
                price: ticketPrice.price,
                startActivity: ticketPrice.startActivity,
                endActivity: ticketPrice.endActivity,
                projectionTypeId: ticketPrice.projectionType?.id,
            })),
            page: result.page,
            size: result.size,
            totalCount: result.totalCount,
            totalPage: result.totalPage,
        };
    }

    async findOne(idParam: IdNumberParamDto): Promise<TicketPriceDetailDto | null> {
        const found = await this.ticketPriceRepository.findById(idParam.id);
        if (!found) {
            return null;
        }

        return {
            id: found.id,
            price: found.price,
            startActivity: found.startActivity,
            endActivity: found.endActivity,
            projectionTypeId: found.projectionType?.id,
        };
    }

    async update(idParam: IdNumberParamDto, ticketPrice: CreateAndUpdateTicketPriceDto): Promise<TicketPriceDetailDto | null> {
        const projectionType = await this.projectionTypeRepository.findById(ticketPrice.projectionTypeId);
        if (!projectionType) {
            throw new NotFoundException(`Projection type not found`);
        }

        const startActivity = new Date(ticketPrice.startActivity);
        const endActivity = new Date(ticketPrice.endActivity);

        const updated = await this.ticketPriceRepository.update(idParam.id, {
            price: ticketPrice.price,
            startActivity,
            endActivity,
            projectionType,
        });

        if (!updated)
            return null;

        return {
            id: updated.id,
            price: updated.price,
            startActivity: updated.startActivity,
            endActivity: updated.endActivity,
            projectionTypeId: updated.projectionType?.id,
        };
    }

    async delete(idParam: IdNumberParamDto): Promise<TicketPriceDetailDto | null>
    {
        const deleted = await this.ticketPriceRepository.delete(idParam.id);
        if (!deleted)
            return null;

        return {
            id: deleted.id,
            price: deleted.price,
            startActivity: deleted.startActivity,
            endActivity: deleted.endActivity,
            projectionTypeId: deleted.projectionType?.id,
        };
    }
}
