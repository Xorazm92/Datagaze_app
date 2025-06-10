// Asosiy NestJS va kerakli modullarni import qilish
import * as dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/.env' });

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * Bootstrap funksiyasi - loyihani ishga tushirish
 * Bu funksiya barcha kerakli konfiguratsiyalarni o'rnatadi va serverni ishga tushiradi
 */
async function bootstrap() {
  // NestJS applicationni yaratish
  const app = await NestFactory.create(AppModule);

  // Barcha API endpointlarga 'api' prefiksini qo'shish
  app.setGlobalPrefix('api');

  // API Versiyalashni yoqish
  app.enableVersioning({
    type: VersioningType.URI,
    // defaultVersion: '1', // Agar kontrollerlarda versiya ko'rsatilmasa, bu ishlatiladi
  });

  // CORS (Cross-Origin Resource Sharing) konfiguratsiyasi
  app.enableCors({
    // Ruxsat berilgan domainlar
    origin: [
      'http://localhost:5173',  // Development frontend server
      'http://localhost:3000',   // Local development
      'https://datagaze-front.vercel.app', // Production frontend
    ],
    // Ruxsat berilgan HTTP metodlar
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // Cookie va autentifikatsiya ma'lumotlarini almashishga ruxsat
    credentials: true,
    // Ruxsat berilgan HTTP headerlar
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    // Frontend tomonidan ko'rinadigan headerlar
    exposedHeaders: ['Authorization'],
  });

  // Global middleware'larni o'rnatish
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }) // DTO validatsiyasi uchun
  );
  app.useGlobalInterceptors(
    new TransformInterceptor() // Response'larni transformatsiya qilish
  );
  app.useGlobalFilters(
    new HttpExceptionFilter() // Xatolarni qayta ishlash
  );

  // Swagger dokumentatsiyasini sozlash
  const config = new DocumentBuilder()
    .setTitle('Datagaze Platform API')
    .setDescription('Datagaze Platform uchun API dokumentatsiyasi')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Autentifikatsiya va avtorizatsiya')
    .addTag('users', 'Foydalanuvchilar bilan ishlash')
    .addTag('files', 'Fayllar bilan ishlash')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Datagaze API Docs',
  });

  // Serverni ishga tushirish
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api/docs`);
}

// Applicationni ishga tushirish
bootstrap();
