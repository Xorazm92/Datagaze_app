import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { AuthModule } from './modules/auth/auth.module';
import { DesktopModule } from './modules/desktop/desktop.module';
import { ComputersModule } from './modules/computers/computers.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KnexModule.forRoot({
      config: databaseConfig,
    }),
    AuthModule,
    DesktopModule,
    ComputersModule,
  ],
})
export class AppModule {}
