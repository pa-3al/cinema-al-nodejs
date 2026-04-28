import {Inject, Injectable, BadRequestException, NotFoundException} from '@nestjs/common';
import {ROOM_IMAGE_REPOSITORY, ROOM_REPOSITORY, STORAGE_PORT} from "../../../domain/global/token";
import {IRoomImageServicePort} from "../../../domain/cinema/room-image/port/room-image-service.port";
import * as roomImageRepositoryPort from "../../../domain/cinema/room-image/port/room-image-repository.port";
import * as storageServicePort from "../../../domain/global/storage/port/storage-service.port";
import {
    AllRoomImageDto,
    CreateAndUpdateRoomImageDto,
    RoomImageDetailsDto, UploadRoomImageDto
} from "../../../domain/cinema/room-image/dto/room-image.dto";
import {IdNumberParamDto, PaginationQueryDto} from "../../../domain/global/dto/global.dto";
import * as roomRepositoryPort from "../../../domain/cinema/room/port/room-repository.port";

@Injectable()
export class RoomImageService implements IRoomImageServicePort {

    constructor(
        @Inject(ROOM_IMAGE_REPOSITORY)
        private readonly roomImageRepository: roomImageRepositoryPort.IRoomImageRepositoryPort,
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository: roomRepositoryPort.IRoomRepositoryPort,
        @Inject(STORAGE_PORT)
        private readonly storageService: storageServicePort.IStorageService
    ){}

    async create(roomImage: CreateAndUpdateRoomImageDto): Promise<RoomImageDetailsDto> {

        const room = await this.roomRepository.findById(roomImage.roomId)

        if (room === null) {
            throw new NotFoundException("Room not found");
        }

        const roomImageCreated = this.roomImageRepository.create(roomImage);

        return await this.roomImageRepository.save(roomImageCreated);
    }

    async findAll(paginationQueryDto : PaginationQueryDto) : Promise<AllRoomImageDto>{
        let page = 1;
        let size = 10;

        if (paginationQueryDto.page != null)
            page = paginationQueryDto.page;
        if (paginationQueryDto.size != null)
            size = paginationQueryDto.size;

        return await this.roomImageRepository.findAll({page, size});
    }

    async findOne(id : IdNumberParamDto) : Promise<RoomImageDetailsDto | null>{
        const roomImage = await this.roomImageRepository.findById(id.id);

        if (roomImage === null) {
            return null;
        }
        roomImage.imageUrl = await this.storageService.getFileUrl(roomImage.imageUrl) || roomImage.imageUrl;
        return roomImage;
    }

    async update(id : IdNumberParamDto, createAndUpdateRoomImageDto : CreateAndUpdateRoomImageDto) : Promise<RoomImageDetailsDto | null> {
        return await this.roomImageRepository.update(id.id, createAndUpdateRoomImageDto);
    }

    async delete(id : IdNumberParamDto) : Promise<RoomImageDetailsDto | null> {
        return await this.roomImageRepository.delete(id.id);
    }

    async createWithUpload(body: UploadRoomImageDto, file: { originalname: string; buffer: Buffer }): Promise<RoomImageDetailsDto>{

        const room = await this.roomRepository.findById(body.roomId)

        if (room === null) {
            throw new NotFoundException("Room not found");
        }

        if (!file) {
            throw new BadRequestException('File is required');
        }

        const fileName = `rooms/${body.roomId}/${Date.now()}-${file.originalname}`;

        await this.storageService.uploadFile(fileName, file.buffer);

        const roomImageToCreate = this.roomImageRepository.create({
            roomId: body.roomId,
            displayOrder: body.displayOrder,
            imageUrl: fileName
        });
        return await this.roomImageRepository.save(roomImageToCreate);
    }
}
