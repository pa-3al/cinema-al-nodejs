import { Employee } from "src/infrastructure/adapters/persistence/sql/entities/employee.entity";
import { getAllResponse } from "../../global/types/global.type";

export interface IEmployeeFilters {
    position?: string;
    isWorkingNow?: boolean;
    page: number;
    size: number;
}

export interface EmployeeRepositoryPort {
    save(employee: Partial<Employee>): Promise<Employee>;
    findById(id: string): Promise<Employee | null>;
    findByUserId(userId: string): Promise<Employee | null>;
    findAll(filters: IEmployeeFilters): Promise<getAllResponse<Employee>>;
    update(id: string, employee: Partial<Employee>): Promise<Employee | null>;
}