import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import knex from 'knex';
import config from '../knexfile';
import * as bcrypt from 'bcrypt';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

(async () => {
  try {
    const db = knex(config.development);

    const superAdmin = {
      username: 'Zufar92',
      email: 'xorazm92@gmail.com',
      role: 'super_admin',
      password: await bcrypt.hash('Admin@123', 10),
    };

    const existingAdmin = await db('admin').where({ username: superAdmin.username }).first();
    if (existingAdmin) {
      console.log('Super admin already exists!');
      return;
    }

    await db('admin').insert(superAdmin);
    console.log('Super admin added to database:', superAdmin);

    await db.destroy();
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global configurations
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global pipes and filters
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Base App API')
    .setDescription('Base App API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
