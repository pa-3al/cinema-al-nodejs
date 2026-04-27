import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TICKET_REPOSITORY } from '../../../domain/global/token';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TicketType } from '../../../../infrastructure/adapters/persistence/sql/entities/ticket.entity';

describe('TicketService', () => {
    let service: TicketService;

    const mockTicketRepository = {
        buyTicketAtomic: jest.fn(),
        findOneWithUsages: jest.fn(),
        findUserTickets: jest.fn(),
        useTicketAtomic: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TicketService,
                { provide: TICKET_REPOSITORY, useValue: mockTicketRepository },
            ],
        }).compile();

        service = module.get<TicketService>(TicketService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('buy', () => {
        it('should throw NotFoundException if saved ticket is not found when fetching details', async () => {
            mockTicketRepository.buyTicketAtomic.mockResolvedValue({ id: 1 });
            mockTicketRepository.findOneWithUsages.mockResolvedValue(null);

            await expect(service.buy('user-1', { ticketType: TicketType.SOLO })).rejects.toThrow(NotFoundException);
        });

        it('should buy a SOLO ticket and map it correctly', async () => {
            const userId = 'user-1';
            const dto = { ticketType: TicketType.SOLO };
            const savedTicket = { id: 1 };
            const detailedTicket = {
                id: 1,
                ticketType: TicketType.SOLO,
                usages: [],
            };

            mockTicketRepository.buyTicketAtomic.mockResolvedValue(savedTicket);
            mockTicketRepository.findOneWithUsages.mockResolvedValue(detailedTicket);

            const result = await service.buy(userId, dto);

            expect(mockTicketRepository.buyTicketAtomic).toHaveBeenCalledWith(userId, TicketType.SOLO, 10);
            expect(result.id).toEqual(1);
            expect(result.totalUses).toEqual(1);
            expect(result.remainingUses).toEqual(1);
            expect(result.usages).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return null if ticket does not exist', async () => {
            mockTicketRepository.findOneWithUsages.mockResolvedValue(null);
            const result = await service.findOne('user-1', { id: 1 });
            expect(result).toBeNull();
        });

        it('should throw ForbiddenException if ticket belongs to another user', async () => {
            const ticket = { id: 1, user: { id: 'other-user' } };
            mockTicketRepository.findOneWithUsages.mockResolvedValue(ticket);

            await expect(service.findOne('user-1', { id: 1 })).rejects.toThrow(ForbiddenException);
        });

        it('should return mapped ticket if ownership is valid', async () => {
            const ticket = {
                id: 1,
                user: { id: 'user-1' },
                ticketType: TicketType.TEN,
                usages: [{ screening: { id: 42 }, usedAt: new Date('2026-04-03T18:50:00.000Z') }],
            };
            mockTicketRepository.findOneWithUsages.mockResolvedValue(ticket);

            const result = await service.findOne('user-1', { id: 1 });

            expect(result?.id).toEqual(1);
            expect(result?.totalUses).toEqual(10);
            expect(result?.usedCount).toEqual(1);
            expect(result?.remainingUses).toEqual(9);
        });
    });

    describe('useTicket', () => {
        it('should throw ForbiddenException if ticket belongs to another user', async () => {
            const ticket = { id: 1, user: { id: 'other-user' } };
            mockTicketRepository.findOneWithUsages.mockResolvedValue(ticket);

            await expect(service.useTicket('user-1', { id: 1 }, { screeningId: 42 })).rejects.toThrow(ForbiddenException);
        });
    });
});