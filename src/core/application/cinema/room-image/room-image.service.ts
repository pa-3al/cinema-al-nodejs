import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { AllRoomImageDto, CreateAndUpdateRoomImageDto, RoomImageDetailsDto, UploadRoomImageDto } from 'src/core/domain/cinema/room-image/dto/room-image.dto';
import { ROOM_IMAGE_REPOSITORY, STORAGE_PORT } from 'src/core/domain/global/token';
import type { IRoomImageRepositoryPort } from '../../../domain/cinema/room-image/port/room-image-repository.port';
import { PaginationQueryDto, IdNumberParamDto } from '../../../domain/global/dto/global.dto';
import { IRoomImageServicePort } from 'src/core/domain/cinema/room-image/port/room-image-service.port';
import type { IStorageService } from 'src/core/domain/global/storage/port/storage-service.port';

@Injectable()
export class RoomImageService implements IRoomImageServicePort {

    constructor (
        @Inject(ROOM_IMAGE_REPOSITORY)
        private readonly roomImageRepository : IRoomImageRepositoryPort,
        @Inject(STORAGE_PORT)
        private readonly storageService : IStorageService
    ){}

    async create(roomImage: CreateAndUpdateRoomImageDto): Promise<RoomImageDetailsDto> {
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
