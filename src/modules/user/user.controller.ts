import { Controller, Get, Req, UseGuards, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import express from "express";
import * as userServicePort from "../../core/domain/user/port/user-service.port";
import {USER_SERVICE} from "../../core/domain/global/token";

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
    constructor(
        @Inject(USER_SERVICE) private readonly userService: userServicePort.IUserServicePort
    ) {
    }

    @Get("me")
    @ApiOperation({summary: "Get current user profile"})
    async getProfile(@Req() req: express.Request) {
        const userId = (req as any).user.id;
        return this.userService.findById(userId);
    }
}