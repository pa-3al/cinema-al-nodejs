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
      .setTitle('Absolute Cinema API')
      .setDescription('Comprehensive API for managing a cinema complex, including movies, screenings, rooms, and employees.')
      .setVersion('1.0')
      .setContact('Absolute Cinema Support', 'https://absolute-cinema.com/support', 'support@absolute-cinema.com')
      .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT access token',
            in: 'header',
          },
          'JWT-auth',
      )
      .addTag('Auth')
      .addTag('Users')
      .addTag('Employees')
      .addTag('Movies')
      .addTag('Screenings')
      .addTag('Rooms')
      .addTag('Room Images')
      .addTag('Movie Genres')
      .addTag('Projection Types')
      .addTag('Tickets')
      .addTag('Ticket Prices')
      .addTag('Statistics')
      .addTag('Monitoring')
      .addServer("http://localhost:3000")
      .addServer("https://api-absolute-cinema.remythibaut.fr")
      .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true
    },
    jsonDocumentUrl: 'swagger/json'
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application en écoute sur http://localhost:${port}`);
}

bootstrap();
