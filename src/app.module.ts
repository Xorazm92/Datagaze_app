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
import { UsersModule } from 'src/modules/users/users.module';
import { SshModule } from './modules/ssh/ssh.module';
import { ProductsModule } from './modules/products/products.module';
import { CommonModule } from './common/common.module';


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

    // Environment o'zgaruvchilarini o'qish uchun modul
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.cwd() + '/.env',
      ignoreEnvVars: true,
    }),

    // JWT (JSON Web Token) konfiguratsiyasi
    JwtModule.registerAsync({
      global: true, // Modulni global qilish
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // JWT maxfiy kaliti
        signOptions: { expiresIn: '1d' }, // Token muddati (1 kun)
      }),
    }),

    // Ma'lumotlar bazasi konfiguratsiyasi (asinxron)
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          client: 'pg',
          connection: {
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            user: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
          },
          pool: {
            min: 2,
            max: 10,
          },
        },
      }),
    }),

    // Loyiha modullari
    AuthModule,      // Autentifikatsiya va avtorizatsiya
    DesktopModule,   // Desktop bilan bog'liq funksionallik
    ComputersModule, // Kompyuterlar bilan ishlash
    AgentModule,      // Agent bilan ishlash (monitoring)
    UsersModule,      // Foydalanuvchilar bilan ishlash
    SshModule,        // SSH ulanishlari bilan ishlash
    ProductsModule,   // Mahsulotlar bilan ishlash
    CommonModule      // Umumiy modullar (masalan, CryptoService)
  ],
})
export class AppModule {}
