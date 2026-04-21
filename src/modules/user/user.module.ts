import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserService } from "../../core/application/cinema/user/user.service";
import { User } from "../../infrastructure/adapters/persistence/sql/entities/user.entity";
import { SqlUserRepository } from "../../infrastructure/adapters/persistence/sql/repositories/sql-user.repository";
import {USER_SERVICE, USER_REPOSITORY, TRANSACTION_REPOSITORY} from "../../core/domain/global/token";
import {Transaction} from "../../infrastructure/adapters/persistence/sql/entities/transaction.entity";
import {
    SqlTransactionRepository
} from "../../infrastructure/adapters/persistence/sql/repositories/sql-transaction.repository";

@Module({
    imports: [TypeOrmModule.forFeature([User, Transaction])],
    controllers: [UserController],
    providers: [
        { provide: USER_SERVICE, useClass: UserService },
        { provide: USER_REPOSITORY, useClass: SqlUserRepository },
        { provide: TRANSACTION_REPOSITORY, useClass: SqlTransactionRepository }
    ],
    exports: [USER_SERVICE]
})
export class UserModule {}