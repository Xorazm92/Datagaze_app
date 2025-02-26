import { Module } from '@nestjs/common';
import { SSHController } from './ssh.controller';
import { SSHService } from './ssh.service';

@Module({
  controllers: [SSHController],
  providers: [SSHService],
  exports: [SSHService],
})
export class SSHModule {}
