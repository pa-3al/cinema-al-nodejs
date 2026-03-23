import { AllRoomDto, CreateAndUpdateRoomDto, RoomDetailDto } from "../dto/room.dto";
import { IdNumberParamDto, PaginationQueryDto } from '../../../global/dto/global.dto';

export interface IRoomServicePort {
    create(room : CreateAndUpdateRoomDto) : Promise<RoomDetailDto>;
    findAll(PaginationQuery : PaginationQueryDto) : Promise<AllRoomDto>;
    findOne(id : IdNumberParamDto) : Promise<RoomDetailDto | null>;
    update(id : IdNumberParamDto, room : CreateAndUpdateRoomDto) : Promise<RoomDetailDto | null>;
    delete(id : IdNumberParamDto) : Promise<RoomDetailDto | null>;
}
