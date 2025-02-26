import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { KnexModule } from 'nest-knexjs';
import { databaseConfig } from '../../config/database.config';

@Module({
  imports: [
    KnexModule.forRoot({
      config: databaseConfig,
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
