import { IdNumberParamDto, PaginationQueryDto } from '../../../global/dto/global.dto';
import { AllRoomImageDto, CreateAndUpdateRoomImageDto, RoomImageDetailsDto } from '../dto/room-image.dto';

export interface IRoomImageServicePort {
    create(roomImage : CreateAndUpdateRoomImageDto) : Promise<RoomImageDetailsDto>;
    findAll(paginationQuery : PaginationQueryDto) : Promise<AllRoomImageDto>;
    findOne(idParam : IdNumberParamDto) : Promise<RoomImageDetailsDto | null>;
    update(idParam : IdNumberParamDto, roomImage : CreateAndUpdateRoomImageDto) : Promise<RoomImageDetailsDto | null>;
    delete(idParam : IdNumberParamDto) : Promise<RoomImageDetailsDto | null>;
}
