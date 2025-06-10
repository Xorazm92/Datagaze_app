import { Module } from '@nestjs/common';
import { DesktopController } from './desktop.controller';
import { DesktopService } from './desktop.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DesktopController],
  providers: [DesktopService],
  exports: [DesktopService],
})
export class DesktopModule {}
