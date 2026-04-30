import { Body, Controller, Post, Req, UseGuards, HttpCode, HttpStatus, Inject, Logger } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiConflictResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { LoginDto, RegisterDto, RefreshTokenDto, TokenResponseDto } from "../../core/domain/auth/dto/auth.dto";
import * as authServicePort from "../../core/domain/auth/port/auth-service.port";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import express from "express";
import { AUTH_SERVICE } from "../../core/domain/global/token";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        @Inject(AUTH_SERVICE) private readonly authService: authServicePort.IAuthServicePort
    ) {}

    @Post("register")
    @ApiOperation({ summary: "Register a new user" })
    @ApiOkResponse({ description: "User successfully registered" })
    @ApiBadRequestResponse({ description: "Bad request - Invalid payload data" })
    @ApiConflictResponse({ description: "Conflict - Email already in use" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async register(@Body() body: RegisterDto) {
        this.logger.log(`Registering new user with email: ${body.email}`);
        return this.authService.register(body);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Login and get tokens" })
    @ApiOkResponse({ type: TokenResponseDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid payload data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized - Bad Credentials" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async login(@Body() body: LoginDto) {
        this.logger.log(`Login attempt for email: ${body.email}`);
        return this.authService.login(body);
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Refresh access token" })
    @ApiOkResponse({ type: TokenResponseDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid payload data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized - Invalid or expired refresh token" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async refresh(@Body() body: RefreshTokenDto) {
        this.logger.log(`Refreshing token`);
        return this.authService.refreshToken(body.refreshToken);
    }

    @Post("logout")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Logout and invalidate tokens" })
    @ApiOkResponse({ description: "Successfully logged out" })
    @ApiBadRequestResponse({ description: "Bad request" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async logout(@Req() req: express.Request, @Body() body: RefreshTokenDto) {
        const userId = (req as any).user.id;
        this.logger.log(`Logout attempt for user id: ${userId}`);
        return this.authService.logout(userId, body.refreshToken);
    }
}