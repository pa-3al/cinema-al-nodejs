import { Inject, Injectable } from "@nestjs/common";
import { AllRoomDto, CreateAndUpdateRoomDto, RoomDetailDto } from "src/core/domain/cinema/room/dto/room.dto";
import type { IRoomRepositoryPort } from "src/core/domain/cinema/room/port/room-repository.port";
import { IRoomServicePort } from "src/core/domain/cinema/room/port/room-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "src/core/domain/global/dto/global.dto";
import { ROOM_REPOSITORY } from "src/core/domain/global/token";
import { Room } from "src/infrastructure/adapters/persistence/sql/entities/room.entity";


@Injectable()
export class RoomService implements IRoomServicePort{

    constructor (
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository : IRoomRepositoryPort
    ) {}

    private mapRoomToDetailDto(room: Room): RoomDetailDto {
        return {
            id: room.id,
            name: room.name,
            description: room.description,
            capacity: room.capacity,
            isMaintenance: room.isMaintenance,
            roomImageIds: room.roomImage?.map(img => img.id) || [],
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
            deletedAt: room.deletedAt
        };
    }

    async create(room : CreateAndUpdateRoomDto) : Promise<RoomDetailDto> {
        const roomCreated = this.roomRepository.create(room);
        return await this.roomRepository.save(roomCreated);
    }

    async findAll(paginationQueryDto : PaginationQueryDto) : Promise<AllRoomDto>{
        let page = 1;
        let size = 10;

        if (paginationQueryDto.page != null)
            page = paginationQueryDto.page;
        if (paginationQueryDto.size != null)
            size = paginationQueryDto.size;

        return await this.roomRepository.findAll({page, size});
    }

    async findOne(idParam: IdNumberParamDto) : Promise<RoomDetailDto | null> {
        const room = await this.roomRepository.findById(idParam.id);
        if (room === null)
            return null;
        return this.mapRoomToDetailDto(room);
    }

    async update(idParam : IdNumberParamDto, room : CreateAndUpdateRoomDto) : Promise<RoomDetailDto | null> {
        return await this.roomRepository.update(idParam.id, room);
    }

    async delete(idParam : IdNumberParamDto) : Promise<RoomDetailDto | null> {
        return await this.roomRepository.delete(idParam.id);
    }
}
