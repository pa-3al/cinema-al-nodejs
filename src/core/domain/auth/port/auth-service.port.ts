import { LoginDto, RegisterDto, TokenResponseDto } from "../dto/auth.dto";

export interface IAuthServicePort {
    register(dto: RegisterDto): Promise<any>;
    login(dto: LoginDto): Promise<TokenResponseDto>;
    refreshToken(oldToken: string): Promise<TokenResponseDto>;
    logout(userId: string, token: string): Promise<void>;
}