import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketController } from "./ticket.controller";
import { TicketPriceController } from "./ticket-price.controller";
import { TicketService } from "../../core/application/cinema/ticket/ticket.service";
import { TicketPriceService } from "../../core/application/cinema/ticket/ticket-price.service";
import { Ticket } from "../../infrastructure/adapters/persistence/sql/entities/ticket.entity";
import { TicketUsage } from "../../infrastructure/adapters/persistence/sql/entities/ticket-usage.entity";
import { TicketPrice } from "../../infrastructure/adapters/persistence/sql/entities/ticket-price.entity";
import { SqlTicketRepository } from "../../infrastructure/adapters/persistence/sql/repositories/sql-ticket.repository";
import { SqlTicketPriceRepository } from "../../infrastructure/adapters/persistence/sql/repositories/sql-ticket-price.repository";
import { TICKET_PRICE_REPOSITORY, TICKET_PRICE_SERVICE, TICKET_REPOSITORY, TICKET_SERVICE } from "../../core/domain/global/token";
import { ProjectionTypeModule } from "../projection-type/projection-type.module";
import { ScreeningModule } from "../screening/screening.module";
import { UserModule } from "../user/user.module";
import {ProjectionType} from "../../infrastructure/adapters/persistence/sql/entities/projection-type.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Ticket, TicketUsage, TicketPrice, ProjectionType]),
        UserModule,
        ScreeningModule,
        ProjectionTypeModule,
    ],
    controllers: [TicketController, TicketPriceController],
    providers: [
        { provide: TICKET_SERVICE, useClass: TicketService },
        { provide: TICKET_PRICE_SERVICE, useClass: TicketPriceService },
        { provide: TICKET_REPOSITORY, useClass: SqlTicketRepository },
        { provide: TICKET_PRICE_REPOSITORY, useClass: SqlTicketPriceRepository },
    ],
    exports: [TICKET_SERVICE, TICKET_PRICE_SERVICE],
})
export class TicketModule {}
