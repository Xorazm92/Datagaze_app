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
    .setDescription(`
      Datagaze Platform Web API - bu kompyuter va ilovalarni boshqarish uchun RESTful API.
      
      ## Asosiy funksiyalar
      - Foydalanuvchilarni boshqarish (Admin/SuperAdmin)
      - Kompyuterlarni boshqarish
      - Ilovalarni o'rnatish va o'chirish
      - Monitoring va hisobotlar
      
      ## Autentifikatsiya
      API JWT (JSON Web Token) autentifikatsiyasidan foydalanadi.
      1. /api/1/auth/login endpointi orqali login qiling
      2. Qaytgan token ni 'Bearer' sxemasi bilan Authorization header da yuboring
    `)
    .setVersion('1.0')
    .addTag('auth', 'Autentifikatsiya va foydalanuvchilarni boshqarish')
    .addTag('computers', 'Kompyuterlarni boshqarish')
    .addTag('applications', 'Ilovalarni boshqarish')
    .addTag('monitoring', 'Monitoring va hisobotlar')
    .addBearerAuth()
    .build();
  
  // Swagger dokumentini yaratish va o'rnatish
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // /api URL da Swagger UI ni o'rnatish

  // Serverni ishga tushirish
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}

// Applicationni ishga tushirish
bootstrap();
