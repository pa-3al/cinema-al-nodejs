import {Controller, Get, Post, Body, UseGuards, Request, Param, Query} from "@nestjs/common";
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import * as userServicePort from "../../core/domain/user/port/user-service.port";
import {USER_SERVICE} from "../../core/domain/global/token";
import {Inject} from "@nestjs/common";
import {AllTransactionsDto, MoneyOperationDto, TransactionDetailDto} from "../../core/domain/user/dto/transaction.dto";
import {RolesGuard} from "../../core/application/cinema/auth/guards/roles.guard";
import {Roles} from "../../core/application/cinema/auth/decorators/roles.decorator";
import {UserActivityDto} from "../../core/domain/user/dto/user-activity.dto";
import {AllUsersDto} from "../../core/domain/user/dto/user.dto";
import {PaginationQueryDto} from "../../core/domain/global/dto/global.dto";

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

    @ApiOperation({ summary: "Get all users" })
    @ApiOkResponse({ type: AllUsersDto })
    @UseGuards(RolesGuard)
    @Roles('employee', 'super_admin')
    @Get()
    async getAllUsers(@Query() query: PaginationQueryDto): Promise<AllUsersDto> {
        return await this.userService.findAllUsers(query);
    }

    @ApiOperation({ summary: "Get all transactions globally" })
    @ApiOkResponse({ type: AllTransactionsDto })
    @UseGuards(RolesGuard)
    @Roles('employee', 'super_admin')
    @Get('transactions/all')
    async getAllTransactionsGlobally(@Query() query: PaginationQueryDto): Promise<AllTransactionsDto> {
        return await this.userService.getAllTransactions(query);
    }

    @ApiOperation({ summary: "See user activities" })
    @UseGuards(RolesGuard)
    @Roles('employee', 'super_admin')
    @Get(':id/activity')
    async getUserActivity(@Param('id') id: string): Promise<UserActivityDto> {
        return await this.userService.getUserActivity(id);
    }

    @ApiOperation({ summary: "Get transaction history of a specific user" })
    @UseGuards(RolesGuard)
    @Roles('employee', 'super_admin')
    @Get(':id/transactions')
    async getUserTransactions(@Param('id') id: string): Promise<TransactionDetailDto[]> {
        return await this.userService.getTransactions(id);
    }
}