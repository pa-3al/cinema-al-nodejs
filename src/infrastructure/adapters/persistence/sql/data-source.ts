import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    entities: [
        'src/infrastructure/adapters/persistence/sql/entities/*.entity.ts',
    ],
    migrations: [
        'src/infrastructure/adapters/persistence/sql/migrations/*.ts',
    ],
    synchronize: false,
});