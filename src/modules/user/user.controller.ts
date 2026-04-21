import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import * as userServicePort from "../../core/domain/user/port/user-service.port";
import {USER_SERVICE} from "../../core/domain/global/token";
import {Inject} from "@nestjs/common";
import {MoneyOperationDto, TransactionDetailDto} from "../../core/domain/user/dto/transaction.dto";

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(
        @Inject(USER_SERVICE) private readonly userService: userServicePort.IUserServicePort
    ) {}

    @ApiOperation({ summary: "Récupérer mon profil et mon solde" })
    @Get('me')
    async getMe(@Request() req) {
        return await this.userService.findById(req.user.id);
    }

    @ApiOperation({ summary: "Déposer de l'argent" })
    @Post('me/deposit')
    async deposit(@Request() req, @Body() dto: MoneyOperationDto) {
        return await this.userService.deposit(req.user.id, dto.amount);
    }

    @ApiOperation({ summary: "Retirer de l'argent" })
    @Post('me/withdraw')
    async withdraw(@Request() req, @Body() dto: MoneyOperationDto) {
        return await this.userService.withdraw(req.user.id, dto.amount);
    }

    @ApiOperation({ summary: "Consulter mon historique de transactions" })
    @Get('me/transactions')
    async getTransactions(@Request() req): Promise<TransactionDetailDto[]> {
        return await this.userService.getTransactions(req.user.id);
    }
}