
import { Module } from '@nestjs/common';
import { DlpController } from './dlp.controller';
import { DlpService } from './dlp.service';

@Module({
  controllers: [DlpController],
  providers: [DlpService],
})
export class DlpModule {}
