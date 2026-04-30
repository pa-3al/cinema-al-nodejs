import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { NotFoundException } from '@nestjs/common';
import { PROJECTION_TYPE_REPOSITORY, ROOM_REPOSITORY, STORAGE_PORT } from "../../../domain/global/token";

describe('RoomService', () => {
    let service: RoomService;

    const mockRoomRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockProjectionTypeRepository = {
        findById: jest.fn(),
    };

    const mockStorageService = {
        getFileUrl: jest.fn(),
        uploadFile: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomService,
                { provide: ROOM_REPOSITORY, useValue: mockRoomRepository },
                { provide: PROJECTION_TYPE_REPOSITORY, useValue: mockProjectionTypeRepository },
                { provide: STORAGE_PORT, useValue: mockStorageService },
            ],
        }).compile();

        service = module.get<RoomService>(RoomService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should throw NotFoundException if projection type does not exist', async () => {
            const dto = { name: 'Room 1', description: 'Desc', capacity: 20, isMaintenance: false, projectionTypeId: 99 };
            mockProjectionTypeRepository.findById.mockResolvedValue(null);

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
        });

        it('should create and return a mapped room', async () => {
            const dto = { name: 'Room 1', description: 'Desc', capacity: 20, isMaintenance: false, projectionTypeId: 1 };
            const projectionType = { id: 1, typeName: 'IMAX' };
            const createdRoom = { ...dto, projectionType };
            const savedRoom = {
                id: 1,
                name: 'Room 1',
                description: 'Desc',
                capacity: 20,
                isMaintenance: false,
                projectionType,
                roomImage: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            };

            mockProjectionTypeRepository.findById.mockResolvedValue(projectionType);
            mockRoomRepository.create.mockReturnValue(createdRoom);
            mockRoomRepository.save.mockResolvedValue(savedRoom);

            const result = await service.create(dto);

            expect(mockRoomRepository.create).toHaveBeenCalledWith({ ...dto, projectionType });
            expect(result.id).toEqual(1);
            expect(result.projectionTypeId).toEqual(1);
            expect(result.roomImageIds).toBeUndefined();
        });
    });

    describe('findOne', () => {
        it('should return a mapped room if found', async () => {
            const idParam = { id: 1 };
            const foundRoom = {
                id: 1,
                name: 'Room 1',
                description: 'Desc',
                capacity: 20,
                isMaintenance: false,
                projectionType: { id: 2, typeName: '3D' },
                roomImage: [{ id: 5 }],
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            };

            mockRoomRepository.findById.mockResolvedValue(foundRoom);

            const result = await service.findOne(idParam);

            expect(result?.id).toEqual(1);
            expect(result?.projectionTypeId).toEqual(2);
        });
    });
});