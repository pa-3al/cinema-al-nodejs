import { User } from "src/infrastructure/adapters/persistence/sql/entities/user.entity";
import {UserActivityDto} from "../dto/user-activity.dto";
import {PaginationQueryDto} from "../../global/dto/global.dto";
import {getAllResponse} from "../../global/types/global.type";

export interface UserRepositoryPort {
    save(user: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updateRole(id: string, role: string): Promise<void>;
    getUserActivityStats(id: string): Promise<UserActivityDto | null>;
    findAll(pagination: PaginationQueryDto): Promise<getAllResponse<User>>;
}