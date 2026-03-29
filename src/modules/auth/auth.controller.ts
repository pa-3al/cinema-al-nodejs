import { Body, Controller, Post, Req, UseGuards, HttpCode, HttpStatus, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from "@nestjs/swagger";
import { LoginDto, RegisterDto, RefreshTokenDto, TokenResponseDto } from "../../core/domain/auth/dto/auth.dto";
import * as authServicePort from "../../core/domain/auth/port/auth-service.port";
import {JwtAuthGuard} from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import express from "express";
import {AUTH_SERVICE} from "../../core/domain/global/token";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authService: authServicePort.IAuthServicePort
    ) {
    }

    @Post("register")
    @ApiOperation({summary: "Register a new user"})
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Login and get tokens"})
    @ApiOkResponse({type: TokenResponseDto})
    async login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Refresh access token"})
    @ApiOkResponse({type: TokenResponseDto})
    async refresh(@Body() body: RefreshTokenDto) {
        return this.authService.refreshToken(body.refreshToken);
    }

    @Post("logout")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Logout and invalidate tokens"})
    async logout(@Req() req: express.Request, @Body() body: RefreshTokenDto) {
        const userId = (req as any).user.id;
        return this.authService.logout(userId, body.refreshToken);
    }
}