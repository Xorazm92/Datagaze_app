// NestJS va boshqa kerakli modullarni import qilish
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { KnexModule } from 'nest-knexjs';

// Loyiha modullarini import qilish
import { AuthModule } from './modules/auth/auth.module';
import { DesktopModule } from './modules/desktop/desktop.module';
import { ComputersModule } from './modules/computers/computers.module';
import { AgentModule } from './modules/agent/agent.module';
import { databaseConfig } from './config/database.config';

/**
 * AppModule - Bu loyihaning asosiy moduli
 * Barcha boshqa modullar shu yerda birlashtiriladi va konfiguratsiya qilinadi
 */
@Module({
  imports: [
    // Statik fayllarni servis qilish uchun modul
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // public papkasi root path
      serveRoot: '/', // Asosiy URL
      renderPath: null, // Server side rendering o'chirilgan
      exclude: ['/api*'], // API endpointlarni statik fayllardan chiqarish
    }),

    // Ma'lumotlar bazasi konfiguratsiyasi (PostgreSQL)
    KnexModule.forRoot({
      config: {
        client: 'postgresql', // PostgreSQL klient
        connection: {
          // Ma'lumotlar bazasi parametrlari (.env faylidan yoki default qiymatlar)
          host: process.env.DB_HOST || '0.0.0.0',
          port: parseInt(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME || 'base_app',
        },
      },
    }),

    // Environment o'zgaruvchilarini o'qish uchun modul
    ConfigModule.forRoot({
      isGlobal: true, // Butun loyiha bo'yicha global qilish
    }),

    // JWT (JSON Web Token) konfiguratsiyasi
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // JWT maxfiy kaliti
        signOptions: { expiresIn: '1d' }, // Token muddati (1 kun)
      }),
    }),

    // Database konfiguratsiyasini alohida fayldan olish
    KnexModule.forRoot({
      config: databaseConfig,
    }),

    // Loyiha modullari
    AuthModule,      // Autentifikatsiya va avtorizatsiya
    DesktopModule,   // Desktop bilan bog'liq funksionallik
    ComputersModule, // Kompyuterlar bilan ishlash
    AgentModule      // Agent bilan ishlash (monitoring)
  ],
})
export class AppModule {}
