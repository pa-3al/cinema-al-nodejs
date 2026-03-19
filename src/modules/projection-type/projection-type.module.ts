import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PROJECTION_TYPE_REPOSITORY, PROJECTION_TYPE_SERVICE} from "../../core/domain/global/token";
import {ProjectionType} from "../../infrastructure/adapters/persistence/sql/entities/projection-type.entity";
import {SqlProjectionTypeRepository} from "../../infrastructure/adapters/persistence/sql/repositories/sql-projection-type.repository";
import {ProjectionTypeService} from "../../core/application/cinema/projection-type/projection-type.service";
import {ProjectionTypeController} from "./projection-type.controller";

@Module({
    imports: [TypeOrmModule.forFeature([ProjectionType])],
    controllers: [ProjectionTypeController],
    providers: [
        {provide: PROJECTION_TYPE_SERVICE, useClass: ProjectionTypeService},
        {provide: PROJECTION_TYPE_REPOSITORY, useClass: SqlProjectionTypeRepository},
    ],
    exports: [PROJECTION_TYPE_SERVICE]
})
export class ProjectionTypeModule {}
