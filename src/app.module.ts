import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { KnexModule } from 'nest-knexjs';
import { AuthModule } from './modules/auth/auth.module';
import { DesktopModule } from './modules/desktop/desktop.module';
import { ComputersModule } from './modules/computers/computers.module';
import { AgentModule } from './modules/agent/agent.module';
import { DlpModule } from './modules/dlp/dlp.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      renderPath: null,
      exclude: ['/api*'],
    }),
    KnexModule.forRoot({
      config: {
        client: 'postgresql',
        connection: {
          host: process.env.DB_HOST || '0.0.0.0',
          port: parseInt(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME || 'base_app',
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    KnexModule.forRoot({
      config: databaseConfig,
    }),
    AuthModule,
    DesktopModule,
    ComputersModule,
    AgentModule,
    DlpModule,
  ],
})
export class AppModule {}
