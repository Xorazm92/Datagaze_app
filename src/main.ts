// Asosiy NestJS va kerakli modullarni import qilish
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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
    new ValidationPipe() // DTO validatsiyasi uchun
  );
  app.useGlobalInterceptors(
    new TransformInterceptor() // Response'larni transformatsiya qilish
  );
  app.useGlobalFilters(
    new HttpExceptionFilter() // Xatolarni qayta ishlash
  );

  // Swagger dokumentatsiyasini sozlash
  const config = new DocumentBuilder()
    .setTitle('Datagaze Platform Web')
    .setDescription('The Datagaze Platform Web API description')
    .setVersion('1.0')
    .addBearerAuth() // JWT autentifikatsiyani qo'shish
    .build();
  
  // Swagger dokumentini yaratish va o'rnatish
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // /api URL da Swagger UI ni o'rnatish

  // Serverni ishga tushirish (3000-portda, barcha interfeyslarda)
  await app.listen(3000, '0.0.0.0');
}

// Applicationni ishga tushirish
bootstrap();
