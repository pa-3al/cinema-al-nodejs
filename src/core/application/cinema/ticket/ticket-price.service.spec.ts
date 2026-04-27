import { Test, TestingModule } from '@nestjs/testing';
import { TicketPriceService } from './ticket-price.service';
import { TICKET_PRICE_REPOSITORY, PROJECTION_TYPE_REPOSITORY } from '../../../domain/global/token';
import { NotFoundException } from '@nestjs/common';

describe('TicketPriceService', () => {
    let service: TicketPriceService;

    const mockTicketPriceRepository = {
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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TicketPriceService,
                { provide: TICKET_PRICE_REPOSITORY, useValue: mockTicketPriceRepository },
                { provide: PROJECTION_TYPE_REPOSITORY, useValue: mockProjectionTypeRepository },
            ],
        }).compile();

        service = module.get<TicketPriceService>(TicketPriceService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should throw NotFoundException if projection type does not exist', async () => {
            const dto = { price: 10, startActivity: '2026-01-01T00:00:00Z', endActivity: '2026-12-31T00:00:00Z', projectionTypeId: 99 };
            mockProjectionTypeRepository.findById.mockResolvedValue(null);

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
        });

        it('should create and map the ticket price properly', async () => {
            const dto = { price: 12.5, startActivity: '2026-01-01T00:00:00Z', endActivity: '2026-12-31T00:00:00Z', projectionTypeId: 1 };
            const projectionType = { id: 1, typeName: 'IMAX' };
            const createdEntity = {
                price: dto.price,
                startActivity: new Date(dto.startActivity),
                endActivity: new Date(dto.endActivity),
                projectionType
            };
            const savedEntity = { id: 1, ...createdEntity };

            mockProjectionTypeRepository.findById.mockResolvedValue(projectionType);
            mockTicketPriceRepository.create.mockReturnValue(createdEntity);
            mockTicketPriceRepository.save.mockResolvedValue(savedEntity);

            const result = await service.create(dto);

            expect(mockTicketPriceRepository.create).toHaveBeenCalledWith(createdEntity);
            expect(mockTicketPriceRepository.save).toHaveBeenCalledWith(createdEntity);
            expect(result.id).toEqual(1);
            expect(result.price).toEqual(12.5);
            expect(result.projectionTypeId).toEqual(1);
        });
    });

    describe('update', () => {
        it('should throw NotFoundException if new projection type does not exist', async () => {
            const idParam = { id: 1 };
            const dto = { price: 15, startActivity: '2026-01-01T00:00:00Z', endActivity: '2026-12-31T00:00:00Z', projectionTypeId: 99 };

            mockProjectionTypeRepository.findById.mockResolvedValue(null);

            await expect(service.update(idParam, dto)).rejects.toThrow(NotFoundException);
        });

        it('should update and map the ticket price properly', async () => {
            const idParam = { id: 1 };
            const dto = { price: 15, startActivity: '2026-01-01T00:00:00Z', endActivity: '2026-12-31T00:00:00Z', projectionTypeId: 2 };
            const projectionType = { id: 2, typeName: '3D' };
            const updatedEntity = {
                id: 1,
                price: dto.price,
                startActivity: new Date(dto.startActivity),
                endActivity: new Date(dto.endActivity),
                projectionType
            };

            mockProjectionTypeRepository.findById.mockResolvedValue(projectionType);
            mockTicketPriceRepository.update.mockResolvedValue(updatedEntity);

            const result = await service.update(idParam, dto);

            expect(mockTicketPriceRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ price: 15 }));
            expect(result?.projectionTypeId).toEqual(2);
        });
    });

    describe('findOne', () => {
        it('should return mapped ticket price if found', async () => {
            const idParam = { id: 1 };
            const foundEntity = { id: 1, price: 10, startActivity: new Date(), endActivity: new Date(), projectionType: { id: 1 } };

            mockTicketPriceRepository.findById.mockResolvedValue(foundEntity);

            const result = await service.findOne(idParam);

            expect(result?.id).toEqual(1);
            expect(result?.projectionTypeId).toEqual(1);
        });
    });
});