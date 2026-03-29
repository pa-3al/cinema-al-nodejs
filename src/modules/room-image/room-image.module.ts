import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomImage } from "src/infrastructure/adapters/persistence/sql/entities/room-image.entity";
import { RoomImageController } from "./room-image.controller";
import { ROOM_IMAGE_REPOSITORY, ROOM_IMAGE_SERVICE, STORAGE_PORT } from "src/core/domain/global/token";
import { RoomImageService } from "src/core/application/cinema/room-image/room-image.service";
import { SqlRoomImageRepository } from "src/infrastructure/adapters/persistence/sql/repositories/sql-room-image.repository";
import { MinioService } from "src/infrastructure/adapters/external/minio.service";

@Module({
    imports: [TypeOrmModule.forFeature([RoomImage])],
    controllers: [RoomImageController],
    providers : [
        {provide : ROOM_IMAGE_SERVICE, useClass: RoomImageService},
        { provide: ROOM_IMAGE_REPOSITORY, useClass: SqlRoomImageRepository },
        { provide: STORAGE_PORT, useClass: MinioService },
    ],
    exports : [ROOM_IMAGE_SERVICE]
})
export class RoomImageModule {}
