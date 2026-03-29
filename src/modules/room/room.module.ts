import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Room } from "src/infrastructure/adapters/persistence/sql/entities/room.entity";
import { RoomController } from "./room.controller";
import { ROOM_REPOSITORY, ROOM_SERVICE } from "src/core/domain/global/token";
import { RoomService } from "src/core/application/cinema/room/room.service";
import { SqlRoomRepository } from "src/infrastructure/adapters/persistence/sql/repositories/sql-room.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Room])],
    controllers: [RoomController],
    providers : [
        {provide : ROOM_SERVICE, useClass: RoomService},
        { provide: ROOM_REPOSITORY, useClass: SqlRoomRepository },
    ],
    exports : [ROOM_SERVICE]
})
export class RoomModule {}
