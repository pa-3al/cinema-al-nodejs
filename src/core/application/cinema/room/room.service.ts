import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import * as projectionTypeRepositoryPort
    from "../../../domain/cinema/projection-type/port/projection-type-repository.port";
import {IRoomServicePort} from "../../../domain/cinema/room/port/room-service.port";
import * as roomRepositoryPort from "../../../domain/cinema/room/port/room-repository.port";
import {PROJECTION_TYPE_REPOSITORY, ROOM_REPOSITORY, STORAGE_PORT} from "../../../domain/global/token";
import {Room} from "../../../../infrastructure/adapters/persistence/sql/entities/room.entity";
import {AllRoomDto, CreateAndUpdateRoomDto, RoomDetailDto} from "../../../domain/cinema/room/dto/room.dto";
import {IdNumberParamDto, PaginationQueryDto} from "../../../domain/global/dto/global.dto";
import * as storageServicePort from "../../../domain/global/storage/port/storage-service.port";


@Injectable()
export class RoomService implements IRoomServicePort {

    constructor(
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository: roomRepositoryPort.IRoomRepositoryPort,
        @Inject(PROJECTION_TYPE_REPOSITORY)
        private readonly projectionTypeRepository: projectionTypeRepositoryPort.IProjectionTypeRepository,
        @Inject(STORAGE_PORT)
        private readonly storageService: storageServicePort.IStorageService
    ) {}

    private async mapRoomToDetailDto(room: Room): Promise<RoomDetailDto> {

        const roomImages = room.roomImage ? await Promise.all(
            room.roomImage.map(async (img) => ({
                id: img.id,
                imageUrl: await this.storageService.getFileUrl(img.imageUrl) || img.imageUrl,
                displayOrder: img.displayOrder,
                roomId: img.roomId,
                createdAt: img.createdAt,
                updatedAt: img.updatedAt,
                deletedAt: img.deletedAt
            }))
        ) : [];

        return {
            id: room.id,
            name: room.name,
            description: room.description,
            capacity: room.capacity,
            isMaintenance: room.isMaintenance,
            roomImages: roomImages,
            projectionTypeId: room.projectionType?.id,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
            deletedAt: room.deletedAt
        };
    }

    async create(room : CreateAndUpdateRoomDto) : Promise<RoomDetailDto> {
        const projectionType = await this.projectionTypeRepository.findById(room.projectionTypeId);

        if (!projectionType) {
            throw new NotFoundException("Projection Type not exists")
        }

        const roomCreated = this.roomRepository.create({
            ...room,
            projectionType: projectionType
        });
        const savedRoom =  await this.roomRepository.save(roomCreated);
        return this.mapRoomToDetailDto(savedRoom);
    }

    async findAll(paginationQueryDto : PaginationQueryDto) : Promise<AllRoomDto>{
        let page = 1;
        let size = 10;

        if (paginationQueryDto.page != null)
            page = paginationQueryDto.page;
        if (paginationQueryDto.size != null)
            size = paginationQueryDto.size;

        const rooms = await this.roomRepository.findAll({page, size});

        const mappedData = await Promise.all(
            rooms.data.map(room => this.mapRoomToDetailDto(room))
        );

        return {
            ...rooms,
            data: mappedData
        }
    }

    async findOne(idParam: IdNumberParamDto) : Promise<RoomDetailDto | null> {
        const room = await this.roomRepository.findById(idParam.id);
        if (room === null)
            return null;
        return await this.mapRoomToDetailDto(room);
    }

    async update(idParam : IdNumberParamDto, room : CreateAndUpdateRoomDto) : Promise<RoomDetailDto | null> {
        const projectionType = await this.projectionTypeRepository.findById(room.projectionTypeId);

        if (!projectionType) {
            throw new NotFoundException("Projection Type not exists")
        }

        const updatedRoom= await this.roomRepository.update(idParam.id, {
            ...room,
            projectionType: projectionType
        });
        if (!updatedRoom) {
            return null;
        }
        return this.mapRoomToDetailDto(updatedRoom)
    }

    async delete(idParam : IdNumberParamDto) : Promise<RoomDetailDto | null> {

        const deletedRoom = await this.roomRepository.delete(idParam.id);
        if (!deletedRoom) {
            return null;
        }
        return this.mapRoomToDetailDto(deletedRoom)
    }
}
