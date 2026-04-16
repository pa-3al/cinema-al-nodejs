import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITicketPriceRepositoryPort } from "../../../../../core/domain/cinema/ticket/port/ticket-price-repository.port";
import { TicketPrice } from "../entities/ticket-price.entity";
import { Repository } from "typeorm";

@Injectable()
export class SqlTicketPriceRepository implements ITicketPriceRepositoryPort {

    constructor(
        @InjectRepository(TicketPrice)
        private readonly ticketPriceRepository: Repository<TicketPrice>,
    ) {}

    async findAll({ page, size }: { page: number; size: number; }) {
        const query = this.ticketPriceRepository
            .createQueryBuilder("ticketPrice")
            .leftJoinAndSelect("ticketPrice.projectionType", "projectionType")
            .orderBy("ticketPrice.startActivity", "DESC");

        query.skip((page - 1) * size);
        query.take(size);

        const [ticketPrices, totalCount] = await query.getManyAndCount();

        return {
            data: ticketPrices,
            page,
            size,
            totalCount,
            totalPage: Math.ceil(totalCount / size),
        };
    }

    async findById(id: number): Promise<TicketPrice | null> {
        return await this.ticketPriceRepository.findOne({
            where: { id },
            relations: { projectionType: true },
        });
    }

    create(ticketPrice: Partial<TicketPrice>): TicketPrice {
        return this.ticketPriceRepository.create(ticketPrice);
    }

    async save(ticketPrice: Partial<TicketPrice>): Promise<TicketPrice> {
        return await this.ticketPriceRepository.save(ticketPrice);
    }

    async update(id: number, ticketPrice: Partial<TicketPrice>): Promise<TicketPrice | null> {
        const found = await this.ticketPriceRepository.findOne({
            where: { id },
            relations: { projectionType: true },
        });

        if (!found) {
            return null;
        }

        if (ticketPrice.price != null) {
            found.price = ticketPrice.price;
        }

        if (ticketPrice.startActivity != null) {
            found.startActivity = ticketPrice.startActivity;
        }

        if (ticketPrice.endActivity != null) {
            found.endActivity = ticketPrice.endActivity;
        }

        if (ticketPrice.projectionType != null) {
            found.projectionType = ticketPrice.projectionType;
        }

        return await this.ticketPriceRepository.save(found);
    }

    async delete(id: number): Promise<TicketPrice | null> {
        const ticketPrice = await this.ticketPriceRepository.findOne({
            where: { id },
            relations: { projectionType: true },
        });

        if (!ticketPrice) {
            return null;
        }

        await this.ticketPriceRepository.softRemove(ticketPrice);
        return ticketPrice;
    }
}
