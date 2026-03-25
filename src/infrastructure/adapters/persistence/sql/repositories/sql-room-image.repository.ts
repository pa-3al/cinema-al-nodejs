import { Injectable } from "@nestjs/common";
import { getAllResponse } from "src/core/domain/global/types/global.type";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomImage } from "../entities/room-image.entity";
import { Repository } from "typeorm";
import { IRoomImageRepositoryPort } from "src/core/domain/cinema/room-image/port/room-image-repository.port";

@Injectable()
export class RoomImageRepository implements IRoomImageRepositoryPort{

    constructor (
        @InjectRepository(RoomImage)
        private readonly roomImageRepository : Repository<RoomImage>
    ) {}

    create(room: Partial<RoomImage>): RoomImage {
        return this.roomImageRepository.create(room)

    }

    async findAll({ page, size }: { page: number; size: number; }): Promise<getAllResponse<RoomImage>> {
        const query = this.roomImageRepository.createQueryBuilder();
        query.skip((page - 1) * size);
        query.take(size);

        const [roomImage, totalCount] = await query.getManyAndCount();

        return {
            data : roomImage,
            size : size,
            page,
            totalCount,
            totalPage : Math.ceil(totalCount / size)
        }
    }

    async findById(id: number): Promise<RoomImage | null> {
        return await this.roomImageRepository.findOneBy({ id })
    }

    async update(id: number, room: Partial<RoomImage>): Promise<RoomImage | null> {
        const roomFind = await this.roomImageRepository.findOneBy({id})

        if (roomFind === null)
            return null;

        if (room.displayOrder != null)
            roomFind.displayOrder = room.displayOrder;

        if (room.imageUrl != null)
            roomFind.imageUrl = room.imageUrl;

        if (room.roomId != null)
            roomFind.roomId = room.roomId;

        return await this.roomImageRepository.save(roomFind);
    }

    async delete(id: number): Promise<RoomImage | null> {
        const roomImage = await this.roomImageRepository.findOneBy({id});

        if (roomImage === null)
            return null;

        await this.roomImageRepository.softRemove(roomImage)
        return roomImage;
    }

    async save(roomImage: RoomImage): Promise<RoomImage> {
        return await this.roomImageRepository.save(roomImage);
    }
}
