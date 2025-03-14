import { Module } from '@nestjs/common';
import { DeploymentController } from './deployment.controller';
import { DeploymentService } from './deployment.service';
import { NotificationsModule } from '../../gateways/notifications.module';  // to'g'ri yo'l
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    NotificationsModule  // NotificationsModule ni qo'shamiz
  ],
  controllers: [DeploymentController],
  providers: [DeploymentService],
  exports: [DeploymentService],
})
export class DeploymentModule {}