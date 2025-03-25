import { Module } from '@nestjs/common';
import { DlpController } from './dlp.controller';
import { DlpService } from './dlp.service';
import { DlpGateway } from './dlp.gateway';
import { KnexModule } from 'nest-knexjs';

@Module({
  imports: [KnexModule],
  controllers: [DlpController],
  providers: [DlpService, DlpGateway],
  exports: [DlpService],
})
export class DlpModule {}