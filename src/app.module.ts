import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { Modules } from './modules/index.module';

import { SECRET_PORT, STORAGE_PORT } from './core/domain/global/token';
import { SecretService } from './infrastructure/adapters/config/secret.service';
import { SecretModule } from './infrastructure/adapters/config/secret.module';
import { MinioService } from './infrastructure/adapters/external/minio.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    SecretModule,

    TypeOrmModule.forRootAsync({
      imports: [SecretModule],
      inject: [SECRET_PORT],
      useFactory: (secrets: SecretService) => ({
        type: 'postgres',
        url: secrets.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
        entities: [
          __dirname +
          '/infrastructure/adapters/persistence/sql/entities/*.entity{.ts,.js}',
        ],
      }),
    }),

    Modules,
  ],
  providers: [
    { provide: STORAGE_PORT, useClass: MinioService },
  ],
  controllers: [AppController],
})
export class AppModule {}