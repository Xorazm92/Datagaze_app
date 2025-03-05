import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Knex from 'knex';
import { KnexModule } from 'nest-knexjs';
import { AuthModule } from './modules/auth/auth.module';
import { ComputersModule } from './modules/computers/computers.module';
import { LicensesModule } from './modules/licenses/licenses.module';
import { databaseConfig } from './config/database.config';
import { AdminModule } from './modules/admin/module';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SoftwareModule } from './modules/software/software.module';
import { NotificationsModule } from './gateways/notifications.module';
import { DeploymentModule } from './modules/deployment/deployment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    KnexModule.forRoot({
      config: databaseConfig,
    }),
    AdminModule,
    AuthModule,
    ComputersModule,
    LicensesModule,
    HttpModule,
    SoftwareModule,
    NotificationsModule,
    DeploymentModule,
  ],
  providers: [
    {
      provide: 'KNEX_CONNECTION',
      useValue: Knex({
        client: 'pg', 
        connection: {
          host: process.env.DATABASE_HOST,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
        },
      }),
    },
  ],
  exports: ['KNEX_CONNECTION'],
})
export class AppModule {}
