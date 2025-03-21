import { Module } from '@nestjs/common';
import { DesktopController } from './desktop.controller';
import { DesktopService } from './desktop.service';

@Module({
  controllers: [DesktopController],
  providers: [DesktopService],
  exports: [DesktopService],
})
export class DesktopModule {}
