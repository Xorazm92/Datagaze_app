import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import knex from 'knex';
import config from '../knexfile';
import * as bcrypt from 'bcrypt';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { logger } from './common/logger/logger.config';
import * as fs from 'fs';
import * as path from 'path';

// Create logs directory if it doesn't exist
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

(async () => {
  try {
    const db = knex(config.development);

    const superAdmin = {
      username: 'Zufar92',
      email: 'xorazm92@gmail.com',
      role: 'super_admin',
      password: await bcrypt.hash('Admin@123', 10),
    };

    const existingAdmin = await db('admin')
      .where({ username: superAdmin.username })
      .first();
    if (existingAdmin) {
      logger.info('Super admin already exists!');
      return;
    }

    await db('admin').insert(superAdmin);
    logger.info('Super admin added to database');

    await db.destroy();
  } catch (error) {
    logger.error('Error occurred while setting up super admin:', error);
  }
})();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // API versioning
    app.setGlobalPrefix('v1');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    // Global pipes and filters
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Swagger setup
    const config = new DocumentBuilder()
      .setTitle('Datagaze All-in-One API')
      .setDescription('API documentation for Datagaze management system')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Start server
    const port = process.env.PORT || 8000;
    await app.listen(port);
    logger.info(`Application is running on: http://localhost:${port}`);
    logger.info(
      `Swagger documentation is available at: http://localhost:${port}/api/docs`,
    );
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
