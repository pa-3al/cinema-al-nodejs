import {Controller, Get, Post, Body, UseGuards, Request, Param} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import * as userServicePort from "../../core/domain/user/port/user-service.port";
import {USER_SERVICE} from "../../core/domain/global/token";
import {Inject} from "@nestjs/common";
import {MoneyOperationDto, TransactionDetailDto} from "../../core/domain/user/dto/transaction.dto";
import {RolesGuard} from "../../core/application/cinema/auth/guards/roles.guard";
import {Roles} from "../../core/application/cinema/auth/decorators/roles.decorator";
import {UserActivityDto} from "../../core/domain/user/dto/user-activity.dto";

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(
        @Inject(USER_SERVICE) private readonly userService: userServicePort.IUserServicePort
    ) {}

    @ApiOperation({ summary: "Get User Profile" })
    @Get('me')
    async getMe(@Request() req) {
        return await this.userService.findById(req.user.id);
    }

    @ApiOperation({ summary: "Deposit money" })
    @Post('me/deposit')
    async deposit(@Request() req, @Body() dto: MoneyOperationDto) {
        return await this.userService.deposit(req.user.id, dto.amount);
    }

    @ApiOperation({ summary: "Withdraw money" })
    @Post('me/withdraw')
    async withdraw(@Request() req, @Body() dto: MoneyOperationDto) {
        return await this.userService.withdraw(req.user.id, dto.amount);
    }

    @ApiOperation({ summary: "Get transaction history" })
    @Get('me/transactions')
    async getTransactions(@Request() req): Promise<TransactionDetailDto[]> {
        return await this.userService.getTransactions(req.user.id);
    }

    @ApiOperation({ summary: "See user activities" })
    @UseGuards(RolesGuard)
    @Roles('employee', 'super_admin')
    @Get(':id/activity')
    async getUserActivity(@Param('id') id: string): Promise<UserActivityDto> {
        return await this.userService.getUserActivity(id);
    }
}