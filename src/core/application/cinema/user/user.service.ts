import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { IUserServicePort } from "../../../domain/user/port/user-service.port";
import { USER_REPOSITORY } from "../../../domain/global/token";
import * as userRepositoryPort from "../../../domain/user/port/user-repository.port";

@Injectable()
export class UserService implements IUserServicePort {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: userRepositoryPort.UserRepositoryPort
    ) {}

    async findById(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
}