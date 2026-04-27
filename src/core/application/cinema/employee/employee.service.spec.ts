import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { EMPLOYEE_REPOSITORY, EMPLOYEE_SCHEDULE_REPOSITORY, USER_REPOSITORY } from '../../../domain/global/token';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EmployeePosition } from "../../../domain/employee/dto/employee.dto";

describe('EmployeeService', () => {
    let service: EmployeeService;

    const mockEmployeeRepository = {
        save: jest.fn(),
        findById: jest.fn(),
        findByUserId: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
    };

    const mockScheduleRepository = {
        save: jest.fn(),
        checkConflict: jest.fn(),
        findSchedulesByEmployeeId: jest.fn(),
        findByEmployeeIdAndDateRange: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockUserRepository = {
        findById: jest.fn(),
        updateRole: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmployeeService,
                { provide: EMPLOYEE_REPOSITORY, useValue: mockEmployeeRepository },
                { provide: EMPLOYEE_SCHEDULE_REPOSITORY, useValue: mockScheduleRepository },
                { provide: USER_REPOSITORY, useValue: mockUserRepository },
            ],
        }).compile();

        service = module.get<EmployeeService>(EmployeeService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createEmployee', () => {
        it('should throw NotFoundException if user is not found', async () => {
            mockUserRepository.findById.mockResolvedValue(null);
            await expect(service.createEmployee({ userId: '1', position: EmployeePosition.PROJECTIONIST })).rejects.toThrow(NotFoundException);
        });

        it('should create an employee and update user role', async () => {
            const user = { id: '1', role: 'user' };
            const employee = { id: 'emp-1', user, position: EmployeePosition.PROJECTIONIST, createdAt: new Date() };

            mockUserRepository.findById.mockResolvedValue(user);
            mockEmployeeRepository.save.mockResolvedValue(employee);

            const result = await service.createEmployee({ userId: '1', position: EmployeePosition.PROJECTIONIST });

            expect(mockUserRepository.updateRole).toHaveBeenCalledWith('1', 'employee');
            expect(mockEmployeeRepository.save).toHaveBeenCalledWith({ user, position: EmployeePosition.PROJECTIONIST });
            expect(result.id).toEqual('emp-1');
        });
    });

    describe('createSchedule', () => {
        it('should throw BadRequestException if end date is before start date', async () => {
            mockEmployeeRepository.findById.mockResolvedValue({ id: 'emp-1', position: EmployeePosition.PROJECTIONIST });

            const dto = {
                startTime: new Date(2026, 3, 28, 10, 0).toISOString(),
                endTime: new Date(2026, 3, 28, 9, 0).toISOString()
            };
            await expect(service.createSchedule('emp-1', dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if dates are not on the same day', async () => {
            mockEmployeeRepository.findById.mockResolvedValue({ id: 'emp-1', position: EmployeePosition.PROJECTIONIST });

            const dto = {
                startTime: new Date(2026, 3, 28, 10, 0).toISOString(),
                endTime: new Date(2026, 3, 29, 12, 0).toISOString()
            };
            await expect(service.createSchedule('emp-1', dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if times are outside 06:00 - 23:00 bounds', async () => {
            mockEmployeeRepository.findById.mockResolvedValue({ id: 'emp-1', position: EmployeePosition.PROJECTIONIST });

            const dto = {
                startTime: new Date(2026, 3, 28, 4, 0).toISOString(),
                endTime: new Date(2026, 3, 28, 5, 0).toISOString()
            };
            await expect(service.createSchedule('emp-1', dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if there is a scheduling conflict', async () => {
            mockEmployeeRepository.findById.mockResolvedValue({ id: 'emp-1', position: EmployeePosition.PROJECTIONIST });
            mockScheduleRepository.checkConflict.mockResolvedValue(true);

            const dto = {
                startTime: new Date(2026, 3, 28, 10, 0).toISOString(),
                endTime: new Date(2026, 3, 28, 12, 0).toISOString()
            };
            await expect(service.createSchedule('emp-1', dto)).rejects.toThrow(BadRequestException);
        });

        it('should create schedule successfully', async () => {
            const employee = { id: 'emp-1', position: EmployeePosition.PROJECTIONIST };
            mockEmployeeRepository.findById.mockResolvedValue(employee);
            mockScheduleRepository.checkConflict.mockResolvedValue(false);

            const startTime = new Date(2026, 3, 28, 10, 0);
            const endTime = new Date(2026, 3, 28, 12, 0);
            const dto = { startTime: startTime.toISOString(), endTime: endTime.toISOString() };
            const savedSchedule = { id: 'sch-1', startTime, endTime, employee };

            mockScheduleRepository.save.mockResolvedValue(savedSchedule);

            const result = await service.createSchedule('emp-1', dto);

            expect(mockScheduleRepository.save).toHaveBeenCalled();
            expect(result.id).toEqual('sch-1');
        });
    });

    describe('deleteSchedule', () => {
        it('should delete schedule if it belongs to the employee', async () => {
            const schedule = { id: 'sch-1', employee: { id: 'emp-1' } };
            mockScheduleRepository.findById.mockResolvedValue(schedule);

            await service.deleteSchedule('emp-1', 'sch-1');

            expect(mockScheduleRepository.delete).toHaveBeenCalledWith('sch-1');
        });

        it('should throw NotFoundException if schedule does not belong to employee', async () => {
            const schedule = { id: 'sch-1', employee: { id: 'emp-99' } };
            mockScheduleRepository.findById.mockResolvedValue(schedule);

            await expect(service.deleteSchedule('emp-1', 'sch-1')).rejects.toThrow(NotFoundException);
        });
    });
});