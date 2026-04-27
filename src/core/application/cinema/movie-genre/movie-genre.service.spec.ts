import { Test, TestingModule } from '@nestjs/testing';
import { MovieGenreService } from './movie-genre.service';
import { MOVIE_GENRE_REPOSITORY } from '../../../domain/global/token';

describe('MovieGenreService', () => {
    let service: MovieGenreService;

    const mockMovieGenreRepository = {
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
                MovieGenreService,
                {
                    provide: MOVIE_GENRE_REPOSITORY,
                    useValue: mockMovieGenreRepository,
                },
            ],
        }).compile();

        service = module.get<MovieGenreService>(MovieGenreService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create and return a movie genre', async () => {
            const dto = { name: 'Action' };
            const createdEntity = { id: 1, name: 'Action' };
            const savedEntity = { id: 1, name: 'Action', createdAt: new Date(), updatedAt: new Date(), deletedAt: null };

            mockMovieGenreRepository.create.mockReturnValue(createdEntity);
            mockMovieGenreRepository.save.mockResolvedValue(savedEntity);

            const result = await service.create(dto);

            expect(mockMovieGenreRepository.create).toHaveBeenCalledWith(dto);
            expect(mockMovieGenreRepository.save).toHaveBeenCalledWith(createdEntity);
            expect(result).toEqual(savedEntity);
        });
    });

    describe('findOnd', () => {
        it('should return a genre if found', async () => {
            const idParam = { id: 1 };
            const foundEntity = { id: 1, name: 'Action', createdAt: new Date(), updatedAt: new Date(), deletedAt: null };

            mockMovieGenreRepository.findById.mockResolvedValue(foundEntity);

            const result = await service.findOnd(idParam);

            expect(mockMovieGenreRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(foundEntity);
        });

        it('should return null if not found', async () => {
            const idParam = { id: 99 };
            mockMovieGenreRepository.findById.mockResolvedValue(null);

            const result = await service.findOnd(idParam);

            expect(result).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should return paginated genres', async () => {
            const query = { page: 2, size: 5 };
            const paginatedResponse = {
                data: [{ id: 1, name: 'Action' }],
                page: 2,
                size: 5,
                totalCount: 1,
                totalPage: 1
            };

            mockMovieGenreRepository.findAll.mockResolvedValue(paginatedResponse);

            const result = await service.findAll(query);

            expect(mockMovieGenreRepository.findAll).toHaveBeenCalledWith({ page: 2, size: 5 });
            expect(result).toEqual(paginatedResponse);
        });
    });
});