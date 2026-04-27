import { Test, TestingModule } from '@nestjs/testing';
import { ProjectionTypeService } from './projection-type.service';
import { PROJECTION_TYPE_REPOSITORY } from '../../../domain/global/token';

describe('ProjectionTypeService', () => {
    let service: ProjectionTypeService;

    const mockProjectionTypeRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectionTypeService,
                { provide: PROJECTION_TYPE_REPOSITORY, useValue: mockProjectionTypeRepository },
            ],
        }).compile();

        service = module.get<ProjectionTypeService>(ProjectionTypeService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create and return a projection type', async () => {
            const dto = { typeName: 'IMAX' };
            const createdEntity = { id: 1, typeName: 'IMAX' };
            const savedEntity = { id: 1, typeName: 'IMAX', createdAt: new Date(), updatedAt: new Date(), deletedAt: null };

            mockProjectionTypeRepository.create.mockReturnValue(createdEntity);
            mockProjectionTypeRepository.save.mockResolvedValue(savedEntity);

            const result = await service.create(dto);

            expect(mockProjectionTypeRepository.create).toHaveBeenCalledWith(dto);
            expect(mockProjectionTypeRepository.save).toHaveBeenCalledWith(createdEntity);
            expect(result).toEqual(savedEntity);
        });
    });

    describe('findOne', () => {
        it('should return a projection type if found', async () => {
            const idParam = { id: 1 };
            const foundEntity = { id: 1, typeName: 'IMAX' };

            mockProjectionTypeRepository.findById.mockResolvedValue(foundEntity);

            const result = await service.findOne(idParam);

            expect(mockProjectionTypeRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(foundEntity);
        });

        it('should return null if projection type is not found', async () => {
            const idParam = { id: 99 };
            mockProjectionTypeRepository.findById.mockResolvedValue(null);

            const result = await service.findOne(idParam);

            expect(result).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should return a paginated list of projection types', async () => {
            const query = { page: 1, size: 10 };
            const paginatedResponse = {
                data: [{ id: 1, typeName: 'IMAX' }],
                page: 1,
                size: 10,
                totalCount: 1,
                totalPage: 1
            };

            mockProjectionTypeRepository.findAll.mockResolvedValue(paginatedResponse);

            const result = await service.findAll(query);

            expect(mockProjectionTypeRepository.findAll).toHaveBeenCalledWith({ page: 1, size: 10 });
            expect(result).toEqual(paginatedResponse);
        });
    });

    describe('update', () => {
        it('should update and return a projection type', async () => {
            const idParam = { id: 1 };
            const dto = { typeName: '3D' };
            const updatedEntity = { id: 1, typeName: '3D' };

            mockProjectionTypeRepository.update.mockResolvedValue(updatedEntity);

            const result = await service.update(idParam, dto);

            expect(mockProjectionTypeRepository.update).toHaveBeenCalledWith(1, dto);
            expect(result).toEqual(updatedEntity);
        });
    });

    describe('delete', () => {
        it('should soft delete and return the projection type', async () => {
            const idParam = { id: 1 };
            const deletedEntity = { id: 1, typeName: 'IMAX', deletedAt: new Date() };

            mockProjectionTypeRepository.delete.mockResolvedValue(deletedEntity);

            const result = await service.delete(idParam);

            expect(mockProjectionTypeRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toEqual(deletedEntity);
        });
    });
});