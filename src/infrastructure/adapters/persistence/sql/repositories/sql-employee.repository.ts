import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "../entities/employee.entity";
import { EmployeeRepositoryPort, IEmployeeFilters } from "src/core/domain/employee/port/employee-repository.port";
import { getAllResponse } from "src/core/domain/global/types/global.type";

@Injectable()
export class SqlEmployeeRepository implements EmployeeRepositoryPort {
    constructor(
        @InjectRepository(Employee)
        private readonly repository: Repository<Employee>
    ) {}

    async save(employee: Partial<Employee>): Promise<Employee> {
        return this.repository.save(employee);
    }

    async findById(id: string): Promise<Employee | null> {
        return this.repository.findOne({ where: { id }, relations: ['user'] });
    }

    async findByUserId(userId: string): Promise<Employee | null> {
        return this.repository.findOne({ where: { user: { id: userId } } });
    }

    async update(id: string, employee: Partial<Employee>): Promise<Employee | null> {
        await this.repository.update(id, employee);
        return this.findById(id);
    }

    async findAll(filters: IEmployeeFilters): Promise<getAllResponse<Employee>> {
        const qb = this.repository.createQueryBuilder("employee")
            .leftJoinAndSelect("employee.user", "user");

        if (filters.position) {
            qb.andWhere("employee.position = :position", { position: filters.position });
        }

        if (filters.isWorkingNow !== undefined) {
            const now = new Date();

            if (filters.isWorkingNow) {
                qb.innerJoin("employee.schedules", "schedule")
                    .andWhere("schedule.startTime <= :now", { now })
                    .andWhere("schedule.endTime >= :now", { now });
            } else {
                qb.where((qb2) => {
                    const subQuery = qb2.subQuery()
                        .select("1")
                        .from("employees_schedules", "s")
                        .where("s.employee_id = employee.id")
                        .andWhere("s.startTime <= :now")
                        .andWhere("s.endTime >= :now")
                        .getQuery();
                    return `NOT EXISTS ${subQuery}`;
                }).setParameters({ now });
            }
        }

        qb.skip((filters.page - 1) * filters.size).take(filters.size);
        const [data, totalCount] = await qb.getManyAndCount();

        return {
            data,
            page: filters.page,
            size: filters.size,
            totalCount,
            totalPage: Math.ceil(totalCount / filters.size)
        };
    }
}