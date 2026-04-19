import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/logging.interceptor';
import type { NextFunction, Request, Response } from 'express';

config({ path: resolve(process.cwd(), '../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
  });
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      req.path.startsWith('/entries') ||
      req.path.startsWith('/tasks') ||
      req.path.startsWith('/users')
    ) {
      res.setHeader('Cache-Control', 'no-store');
    }

    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Users API')
    .setDescription('Users API protected by OIDC JWT authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  await app.listen(port);
}
bootstrap();
