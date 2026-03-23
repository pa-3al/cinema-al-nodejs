import { Injectable } from "@nestjs/common";
import { getAllResponse } from "src/core/domain/global/types/global.type";
import { InjectRepository } from "@nestjs/typeorm";
import { Room } from "../entities/room.entity";
import { Repository } from "typeorm";
import { IRoomRepository } from "src/core/domain/cinema/room/port/room-repository.port";

@Injectable()
export class RoomRepository implements IRoomRepository{

    constructor (
        @InjectRepository(Room)
        private readonly roomRepository : Repository<Room>
    ) {}

    create(room: Partial<Room>): Room {
        return this.roomRepository.create(room)

    }

    async findAll({ page, size }: { page: number; size: number; }): Promise<getAllResponse<Room>> {
        const query = this.roomRepository.createQueryBuilder();
        query.skip((page - 1) * size);
        query.take(size);

        const [room, totalCount] = await query.getManyAndCount();

        return {
            data : room,
            size : size,
            page,
            totalCount,
            totalPage : Math.ceil(totalCount / size)
        }
    }

    async findById(id: number): Promise<Room | null> {
        return await this.roomRepository.findOneBy({ id })
    }

    async update(id: number, room: Partial<Room>): Promise<Room | null> {
        const roomFind = await this.roomRepository.findOneBy({id})

        if (roomFind === null)
            return null;

        if (room.capacity != null)
            roomFind.capacity = room.capacity;

        if (room.description != null)
            roomFind.description = room.description;

        if (room.isMaintenance != null)
            roomFind.isMaintenance = room.isMaintenance;

        if (room.name != null)
            roomFind.name = room.name;

        if (room.roomImage != null)
            roomFind.roomImage = room.roomImage;

        return await this.roomRepository.save(roomFind);
    }

    async delete(id: number): Promise<Room | null> {
        const room = await this.roomRepository.findOneBy({id});

        if (room === null)
            return null;

        await this.roomRepository.softRemove(room)
        return room;
    }

    async save(room: Room): Promise<Room> {
        return await this.roomRepository.save(room);
    }
}
