import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MOVIE_REPOSITORY, SCREENING_REPOSITORY, STORAGE_PORT, MOVIE_GENRE_REPOSITORY } from '../../../domain/global/token';
import { BadRequestException } from '@nestjs/common';

describe('MovieService', () => {
    let service: MovieService;

    const mockMovieRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockScreeningRepository = {
        findByMovieIdAndDateRange: jest.fn(),
    };

    const mockStorageService = {
        getFileUrl: jest.fn(),
        uploadFile: jest.fn(),
    };

    const mockMovieGenreRepository = {
        findById: jest.fn().mockResolvedValue({ id: 1, name: 'Comédie' }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MovieService,
                { provide: MOVIE_REPOSITORY, useValue: mockMovieRepository },
                { provide: SCREENING_REPOSITORY, useValue: mockScreeningRepository },
                { provide: STORAGE_PORT, useValue: mockStorageService },
                { provide: MOVIE_GENRE_REPOSITORY, useValue: mockMovieGenreRepository },
            ],
        }).compile();

        service = module.get<MovieService>(MovieService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a movie without a file', async () => {
            const dto = { title: 'Test Movie', synopsis: 'Desc', durationMinutes: 120, releaseDate: '2026-01-01T00:00:00Z', genreId: 1 };
            const genre = { id: 1, name: 'Comédie' };
            const createdMovie = { title: dto.title, synopsis: dto.synopsis, durationMinutes: dto.durationMinutes, releaseDate: new Date(dto.releaseDate), genre, posterUrl: null };
            const savedMovie = { id: 1, ...createdMovie };

            mockMovieRepository.create.mockReturnValue(createdMovie);
            mockMovieRepository.save.mockResolvedValue(savedMovie);

            const result = await service.create(dto);

            expect(mockMovieRepository.create).toHaveBeenCalledWith(createdMovie);
            expect(mockMovieRepository.save).toHaveBeenCalledWith(createdMovie);
            expect(result.id).toEqual(1);
            expect(result.posterUrl).toBeNull();
        });

        it('should create a movie and upload a poster file', async () => {
            const dto = { title: 'Test Movie', synopsis: 'Desc', durationMinutes: 120, releaseDate: '2026-01-01T00:00:00Z', genreId: 1 };
            const genre = { id: 1, name: 'Comédie' };
            const file = { originalname: 'poster.jpg', buffer: Buffer.from('test') };
            const createdMovie = { title: dto.title, synopsis: dto.synopsis, durationMinutes: dto.durationMinutes, releaseDate: new Date(dto.releaseDate), genre, posterUrl: expect.any(String) };
            const savedMovie = { id: 1, ...createdMovie, posterUrl: 'movies/posters/123-poster.jpg' };

            mockStorageService.uploadFile.mockResolvedValue(undefined);
            mockMovieRepository.create.mockReturnValue(createdMovie);
            mockMovieRepository.save.mockResolvedValue(savedMovie);
            mockStorageService.getFileUrl.mockResolvedValue('https://s3/poster.jpg');

            const result = await service.create(dto, file);

            expect(mockStorageService.uploadFile).toHaveBeenCalled();
            expect(result.posterUrl).toEqual('https://s3/poster.jpg');
        });
    });

    describe('getPlanningForNextMonth', () => {
        it('should return null if movie does not exist', async () => {
            mockMovieRepository.findById.mockResolvedValue(null);

            const result = await service.getPlanningForNextMonth({ id: 99 }, {});

            expect(result).toBeNull();
        });

        it('should throw BadRequestException if startDate is after endDate', async () => {
            mockMovieRepository.findById.mockResolvedValue({ id: 1, title: 'Test' });
            const query = { startDate: '2026-05-01T00:00:00Z', endDate: '2026-04-01T00:00:00Z' };

            await expect(service.getPlanningForNextMonth({ id: 1 }, query)).rejects.toThrow(BadRequestException);
        });

        it('should return planning with screenings', async () => {
            const movie = { id: 1, title: 'Test Movie', posterUrl: null, genre: { name: 'Comédie' } };
            const query = { startDate: '2026-04-01T00:00:00Z', endDate: '2026-04-30T00:00:00Z' };
            const screenings = [
                { id: 10, movie, room: { id: 2, name: 'Room 1' }, startTime: new Date(), endTime: new Date() }
            ];

            mockMovieRepository.findById.mockResolvedValue(movie);
            mockScreeningRepository.findByMovieIdAndDateRange.mockResolvedValue(screenings);

            const result = await service.getPlanningForNextMonth({ id: 1 }, query);

            expect(mockScreeningRepository.findByMovieIdAndDateRange).toHaveBeenCalled();
            expect(result?.movie.id).toEqual(1);
            expect(result?.screenings.length).toEqual(1);
            expect(result?.screenings[0].id).toEqual(10);
            expect(result?.screenings[0].roomName).toEqual('Room 1');
        });
    });
});