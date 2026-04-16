import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import {LokiLogger} from "./infrastructure/adapters/logging/logging.service";

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger : new LokiLogger()
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
      .setTitle('API Cinema AL')
      .setDescription('Description')
      .setVersion('1.0')
      .addTag('test')
      .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json'
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application en écoute sur http://localhost:${port}`);
}

bootstrap();
