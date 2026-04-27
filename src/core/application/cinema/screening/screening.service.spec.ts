import { Test, TestingModule } from '@nestjs/testing';
import { ScreeningService } from './screening.service';
import { SCREENING_REPOSITORY, MOVIE_REPOSITORY, ROOM_REPOSITORY } from '../../../domain/global/token';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';

describe('ScreeningService', () => {
    let service: ScreeningService;

    const mockScreeningRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        hasRoomConflict: jest.fn(),
        hasMovieConflict: jest.fn(),
    };

    const mockMovieRepository = {
        findById: jest.fn(),
    };

    const mockRoomRepository = {
        findById: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ScreeningService,
                { provide: SCREENING_REPOSITORY, useValue: mockScreeningRepository },
                { provide: MOVIE_REPOSITORY, useValue: mockMovieRepository },
                { provide: ROOM_REPOSITORY, useValue: mockRoomRepository },
            ],
        }).compile();

        service = module.get<ScreeningService>(ScreeningService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should throw NotFoundException if movie is not found', async () => {
            mockMovieRepository.findById.mockResolvedValue(null);

            const dto = { movieId: 1, roomId: 2, startTime: '2030-01-01T10:00:00Z' };
            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if room is in maintenance', async () => {
            mockMovieRepository.findById.mockResolvedValue({ id: 1, durationMinutes: 120 });
            mockRoomRepository.findById.mockResolvedValue({ id: 2, isMaintenance: true });

            const dto = { movieId: 1, roomId: 2, startTime: '2030-01-01T10:00:00Z' };
            await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if startTime is in the past', async () => {
            mockMovieRepository.findById.mockResolvedValue({ id: 1, durationMinutes: 120 });
            mockRoomRepository.findById.mockResolvedValue({ id: 2, isMaintenance: false });

            const dto = { movieId: 1, roomId: 2, startTime: '2000-01-01T10:00:00Z' };
            await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw ConflictException if room has a conflict', async () => {
            mockMovieRepository.findById.mockResolvedValue({ id: 1, durationMinutes: 120 });
            mockRoomRepository.findById.mockResolvedValue({ id: 2, isMaintenance: false });
            mockScreeningRepository.hasRoomConflict.mockResolvedValue(true);

            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            if (nextWeek.getDay() === 0 || nextWeek.getDay() === 6) {
                nextWeek.setDate(nextWeek.getDate() + 2);
            }
            nextWeek.setHours(10, 0, 0, 0);

            const dto = { movieId: 1, roomId: 2, startTime: nextWeek.toISOString() };
            await expect(service.create(dto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findOne', () => {
        it('should return null if screening not found', async () => {
            mockScreeningRepository.findById.mockResolvedValue(null);
            const result = await service.findOne({ id: 99 });
            expect(result).toBeNull();
        });

        it('should return mapped screening if found', async () => {
            const screening = {
                id: 1,
                movie: { id: 1, title: 'Inception' },
                room: { id: 2, name: 'Room A' },
                startTime: new Date(),
                endTime: new Date(),
            };
            mockScreeningRepository.findById.mockResolvedValue(screening);

            const result = await service.findOne({ id: 1 });

            expect(result?.id).toEqual(1);
            expect(result?.movieTitle).toEqual('Inception');
            expect(result?.roomName).toEqual('Room A');
        });
    });
});