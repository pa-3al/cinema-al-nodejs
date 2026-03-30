import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Token manquant');
        }

        const token = authHeader.split(' ')[1];

        try {
            const secret = process.env.JWT_ACCESS_SECRET || 'secret_access';
            const decoded = jwt.verify(token, secret);
            request['user'] = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token invalide ou expiré');
        }
    }
}