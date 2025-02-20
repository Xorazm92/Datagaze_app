import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KnexModule.forRoot({
      config: {
        client: 'postgresql',
        connection: {
          host: 'localhost',
          user: 'postgres',
          password: 'postgres',
          database: 'base_app',
          port: 5432
        }
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
