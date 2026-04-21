import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Screening } from "../../infrastructure/adapters/persistence/sql/entities/screening.entity";
import { StatisticsController } from "./statistics.controller";
import { StatisticsService } from "../../core/application/cinema/statistics/statistics.service";
import { STATISTICS_REPOSITORY, STATISTICS_SERVICE } from "../../core/domain/global/token";
import {
    SqlStatisticsRepository
} from "../../infrastructure/adapters/persistence/sql/repositories/sql-statistics.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Screening])],
    controllers: [StatisticsController],
    providers: [
        {
            provide: STATISTICS_REPOSITORY,
            useClass: SqlStatisticsRepository,
        },
        {
            provide: STATISTICS_SERVICE,
            useClass: StatisticsService,
        },
    ],
    exports: [STATISTICS_SERVICE],
})
export class StatisticsModule {}