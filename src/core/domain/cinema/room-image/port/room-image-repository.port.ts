import { getAllResponse } from "src/core/domain/global/types/global.type";
import { RoomImage } from "src/infrastructure/adapters/persistence/sql/entities/room-image.entity";


export interface IRoomImageRepositoryPort {
    create(roomImage : Partial<RoomImage>) : RoomImage;
    findAll({page, size} : {page : number, size : number}) : Promise<getAllResponse<RoomImage>>;
    findById(id : number) : Promise<RoomImage | null>;
    update(id : number, roomImage : Partial<RoomImage>) : Promise<RoomImage | null>;
    delete(id : number) : Promise<RoomImage | null>;
    save(roomImage : RoomImage) : Promise<RoomImage>;
}
