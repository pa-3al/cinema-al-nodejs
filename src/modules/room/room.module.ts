import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Room } from "src/infrastructure/adapters/persistence/sql/entities/room.entity";
import { RoomController } from "./room.controller";
import {PROJECTION_TYPE_REPOSITORY, ROOM_REPOSITORY, ROOM_SERVICE, STORAGE_PORT} from "src/core/domain/global/token";
import { RoomService } from "src/core/application/cinema/room/room.service";
import { SqlRoomRepository } from "src/infrastructure/adapters/persistence/sql/repositories/sql-room.repository";
import {
    SqlProjectionTypeRepository
} from "../../infrastructure/adapters/persistence/sql/repositories/sql-projection-type.repository";
import {ProjectionType} from "../../infrastructure/adapters/persistence/sql/entities/projection-type.entity";
import {MinioService} from "../../infrastructure/adapters/external/minio.service";

@Module({
    imports: [TypeOrmModule.forFeature([Room, ProjectionType])],
    controllers: [RoomController],
    providers : [
        {provide : ROOM_SERVICE, useClass: RoomService},
        { provide: ROOM_REPOSITORY, useClass: SqlRoomRepository },
        { provide: PROJECTION_TYPE_REPOSITORY, useClass: SqlProjectionTypeRepository},
        { provide: STORAGE_PORT, useClass: MinioService },
    ],
    exports : [ROOM_SERVICE]
})
export class RoomModule {}
