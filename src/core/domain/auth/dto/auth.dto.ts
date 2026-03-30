import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: "john.doe@email.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "password123" })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: "John" })
    @IsString()
    firstname: string;

    @ApiProperty({ example: "Doe" })
    @IsString()
    lastname: string;
}

export class LoginDto {
    @ApiProperty({ example: "john.doe@email.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "password123" })
    @IsString()
    password: string;
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    refreshToken: string;
}

export class TokenResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}