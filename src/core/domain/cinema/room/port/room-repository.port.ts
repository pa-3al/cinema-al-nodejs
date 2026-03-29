import { getAllResponse } from "src/core/domain/global/types/global.type";
import { Room } from "src/infrastructure/adapters/persistence/sql/entities/room.entity";


export interface IRoomRepositoryPort {
    create(room : Partial<Room>) : Room;
    findAll({page, size} : {page : number, size : number}) : Promise<getAllResponse<Room>>;
    findById(id : number) : Promise<Room | null>;
    update(id : number, room : Partial<Room>) : Promise<Room | null>;
    delete(id : number) : Promise<Room | null>;
    save(room : Room) : Promise<Room>;
}
