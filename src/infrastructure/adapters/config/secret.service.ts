import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ISecretManager } from '../../../core/domain/global/config/port/secret-manager.port';

dotenv.config();

@Injectable()
export class SecretService implements ISecretManager {
    get<T = string>(key: string): T {
        const value = process.env[key];
        if (value === undefined) {
            throw new Error(`Missing environment variable: ${key}`);
        }

        return value as unknown as T;
    }
}