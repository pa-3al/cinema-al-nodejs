import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({
        example: "remy.machavoine@email.com",
        description: "User's email address (must be unique and valid)"
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: "password123",
        description: "User's password (minimum 8 characters)"
    })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({
        example: "Rémy",
        description: "User's first name"
    })
    @IsString()
    firstname: string;

    @ApiProperty({
        example: "Machavoine",
        description: "User's last name"
    })
    @IsString()
    lastname: string;
}

export class LoginDto {
    @ApiProperty({
        example: "remy.machavoine@email.com",
        description: "User's email address"
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: "password123",
        description: "User's password"
    })
    @IsString()
    password: string;
}

export class RefreshTokenDto {
    @ApiProperty({
        example: "your-refresh-token",
        description: "Refresh token used to obtain a new access token"
    })
    @IsString()
    refreshToken: string;
}

export class TokenResponseDto {
    @ApiProperty({
        description: "JWT access token used to authenticate API requests"
    })
    accessToken: string;

    @ApiProperty({
        description: "JWT refresh token used to generate a new access token"
    })
    refreshToken: string;
}