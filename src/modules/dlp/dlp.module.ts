
import { Module } from '@nestjs/common';
import { DlpController } from './dlp.controller';
import { DlpService } from './dlp.service';
import { DlpGateway } from './dlp.gateway';

@Module({
  controllers: [DlpController],
  providers: [DlpService, DlpGateway],
})
export class DlpModule {}
