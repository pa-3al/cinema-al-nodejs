import { Controller, Get, Post, Body, UseGuards, Request, Param, Query, Inject, Logger } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import * as userServicePort from "../../core/domain/user/port/user-service.port";
import { USER_SERVICE } from "../../core/domain/global/token";
import { AllTransactionsDto, MoneyOperationDto, TransactionDetailDto } from "../../core/domain/user/dto/transaction.dto";
import { RolesGuard } from "../../core/application/cinema/auth/guards/roles.guard";
import { Roles } from "../../core/application/cinema/auth/decorators/roles.decorator";
import { UserActivityDto } from "../../core/domain/user/dto/user-activity.dto";
import { AllUsersDto } from "../../core/domain/user/dto/user.dto";
import { PaginationQueryDto } from "../../core/domain/global/dto/global.dto";

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        @Inject(USER_SERVICE) private readonly userService: userServicePort.IUserServicePort
    ) {}

    @ApiOperation({ summary: "Get User Profile" })
    @ApiOkResponse({ description: "Successfully retrieved user profile" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @Get('me')
    async getMe(@Request() req) {
        this.logger.log(`Fetching profile for user id: ${req.user.id}`);
        return await this.userService.findById(req.user.id);
    }

    @ApiOperation({ summary: "Deposit money" })
    @ApiOkResponse({ description: "Successfully deposited money" })
    @ApiBadRequestResponse({ description: "Bad request - Amount must be positive" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @Post('me/deposit')
    async deposit(@Request() req, @Body() dto: MoneyOperationDto) {
        this.logger.log(`User ${req.user.id} depositing amount: ${dto.amount}`);
        return await this.userService.deposit(req.user.id, dto.amount);
    }

    @ApiOperation({ summary: "Withdraw money" })
    @ApiOkResponse({ description: "Successfully withdrew money" })
    @ApiBadRequestResponse({ description: "Bad request - Amount must be positive or not enough balance" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @Post('me/withdraw')
    async withdraw(@Request() req, @Body() dto: MoneyOperationDto) {
        this.logger.log(`User ${req.user.id} withdrawing amount: ${dto.amount}`);
        return await this.userService.withdraw(req.user.id, dto.amount);
    }

    @ApiOperation({ summary: "Get transaction history" })
    @ApiOkResponse({ description: "Successfully retrieved transactions" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @Get('me/transactions')
    async getTransactions(@Request() req): Promise<TransactionDetailDto[]> {
        this.logger.log(`Fetching transaction history for user id: ${req.user.id}`);
        return await this.userService.getTransactions(req.user.id);
    }

    @ApiOperation({ summary: "Get all users" })
    @ApiOkResponse({ type: AllUsersDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @UseGuards(RolesGuard)
    @Roles('employee', 'super_admin')
    @Get()
    async getAllUsers(@Query() query: PaginationQueryDto): Promise<AllUsersDto> {
        this.logger.log(`Fetching all users with pagination: page ${query.page}, size ${query.size}`);
        return await this.userService.findAllUsers(query);
    }

    @ApiOperation({ summary: "Get all transactions globally" })
    @ApiOkResponse({ type: AllTransactionsDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @UseGuards(RolesGuard)
    @Roles('employee', 'super_admin')
    @Get('transactions/all')
    async getAllTransactionsGlobally(@Query() query: PaginationQueryDto): Promise<AllTransactionsDto> {
        this.logger.log(`Fetching all global transactions with pagination: page ${query.page}, size ${query.size}`);
        return await this.userService.getAllTransactions(query);
    }

    @ApiOperation({ summary: "See user activities" })
    @ApiOkResponse({ description: "Successfully retrieved user activity" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @UseGuards(RolesGuard)
    @Roles('employee', 'super_admin')
    @Get(':id/activity')
    async getUserActivity(@Param('id') id: string): Promise<UserActivityDto> {
        this.logger.log(`Fetching activity for user id: ${id}`);
        return await this.userService.getUserActivity(id);
    }

    @ApiOperation({ summary: "Get transaction history of a specific user" })
    @ApiOkResponse({ description: "Successfully retrieved user transactions" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "User not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @UseGuards(RolesGuard)
    @Roles('employee', 'super_admin')
    @Get(':id/transactions')
    async getUserTransactions(@Param('id') id: string): Promise<TransactionDetailDto[]> {
        this.logger.log(`Fetching transactions for specific user id: ${id}`);
        return await this.userService.getTransactions(id);
    }
}