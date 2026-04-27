import { Test, TestingModule } from '@nestjs/testing';
import { RoomImageService } from './room-image.service';
import { ROOM_IMAGE_REPOSITORY, STORAGE_PORT } from '../../../domain/global/token';
import { BadRequestException } from '@nestjs/common';

describe('RoomImageService', () => {
    let service: RoomImageService;

    const mockRoomImageRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockStorageService = {
        getFileUrl: jest.fn(),
        uploadFile: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomImageService,
                { provide: ROOM_IMAGE_REPOSITORY, useValue: mockRoomImageRepository },
                { provide: STORAGE_PORT, useValue: mockStorageService },
            ],
        }).compile();

        service = module.get<RoomImageService>(RoomImageService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createWithUpload', () => {
        it('should throw BadRequestException if file is missing', async () => {
            const dto = { roomId: 1, displayOrder: 1 };
            await expect(service.createWithUpload(dto, undefined as any)).rejects.toThrow(BadRequestException);
        });

        it('should upload file and save room image', async () => {
            const dto = { roomId: 1, displayOrder: 1 };
            const file = { originalname: 'test.jpg', buffer: Buffer.from('test') };
            const createdEntity = { roomId: 1, displayOrder: 1, imageUrl: 'path/to/image.jpg' };
            const savedEntity = { id: 1, ...createdEntity };

            mockStorageService.uploadFile.mockResolvedValue(undefined);
            mockRoomImageRepository.create.mockReturnValue(createdEntity);
            mockRoomImageRepository.save.mockResolvedValue(savedEntity);

            const result = await service.createWithUpload(dto, file);

            expect(mockStorageService.uploadFile).toHaveBeenCalled();
            expect(mockRoomImageRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                roomId: 1,
                displayOrder: 1,
                imageUrl: expect.stringContaining('test.jpg')
            }));
            expect(mockRoomImageRepository.save).toHaveBeenCalledWith(createdEntity);
            expect(result).toEqual(savedEntity);
        });
    });

    describe('findOne', () => {
        it('should return null if room image is not found', async () => {
            const idParam = { id: 99 };
            mockRoomImageRepository.findById.mockResolvedValue(null);

            const result = await service.findOne(idParam);

            expect(result).toBeNull();
        });

        it('should retrieve a presigned URL if image is found', async () => {
            const idParam = { id: 1 };
            const foundEntity = { id: 1, imageUrl: 'absolute/cinema.jpg' };
            const presignedUrl = 'https://absolute-cinema/image.jpg';

            mockRoomImageRepository.findById.mockResolvedValue(foundEntity);
            mockStorageService.getFileUrl.mockResolvedValue(presignedUrl);

            const result = await service.findOne(idParam);

            expect(mockStorageService.getFileUrl).toHaveBeenCalledWith('absolute/cinema.jpg');
            expect(result?.imageUrl).toEqual(presignedUrl);
        });
    });

    describe('findAll', () => {
        it('should return paginated room images', async () => {
            const query = { page: 1, size: 5 };
            const paginatedResponse = {
                data: [{ id: 1, imageUrl: 'image.jpg' }],
                page: 1,
                size: 5,
                totalCount: 1,
                totalPage: 1
            };

            mockRoomImageRepository.findAll.mockResolvedValue(paginatedResponse);

            const result = await service.findAll(query);

            expect(mockRoomImageRepository.findAll).toHaveBeenCalledWith({ page: 1, size: 5 });
            expect(result).toEqual(paginatedResponse);
        });
    });
});