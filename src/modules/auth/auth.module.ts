import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "../../core/application/cinema/auth/auth.service";
import { User } from "../../infrastructure/adapters/persistence/sql/entities/user.entity";
import { RefreshToken } from "../../infrastructure/adapters/persistence/sql/entities/refresh-tokens.entity";
import { SqlUserRepository } from "../../infrastructure/adapters/persistence/sql/repositories/sql-user.repository";
import { SqlRefreshTokenRepository } from "../../infrastructure/adapters/persistence/sql/repositories/sql-refresh-token.repository";
import { AUTH_SERVICE, USER_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from "../../core/domain/global/token";

@Module({
    imports: [TypeOrmModule.forFeature([User, RefreshToken])],
    controllers: [AuthController],
    providers: [
        { provide: AUTH_SERVICE, useClass: AuthService },
        { provide: USER_REPOSITORY, useClass: SqlUserRepository },
        { provide: REFRESH_TOKEN_REPOSITORY, useClass: SqlRefreshTokenRepository }
    ],
    exports: [AUTH_SERVICE]
})
export class AuthModule {}