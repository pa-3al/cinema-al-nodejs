import { Inject, Injectable } from "@nestjs/common";
import { AllRoomDto, CreateAndUpdateRoomDto, RoomDetailDto } from "src/core/domain/cinema/room/dto/room.dto";
import type { IRoomRepositoryPort } from "src/core/domain/cinema/room/port/room-repository.port";
import { IRoomServicePort } from "src/core/domain/cinema/room/port/room-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "src/core/domain/global/dto/global.dto";
import { ROOM_REPOSITORY } from "src/core/domain/global/token";


@Injectable()
export class RoomService implements IRoomServicePort{

    constructor (
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository : IRoomRepositoryPort
    ) {}

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
        return await this.roomRepository.findById(idParam.id);
    }

    async update(idParam : IdNumberParamDto, room : CreateAndUpdateRoomDto) : Promise<RoomDetailDto | null> {
        return await this.roomRepository.update(idParam.id, room);
    }

    async delete(idParam : IdNumberParamDto) : Promise<RoomDetailDto | null> {
        return await this.roomRepository.delete(idParam.id);
    }
}
