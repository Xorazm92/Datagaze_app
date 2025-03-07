import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationGateway } from './notification.gateway';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    NotificationGateway,
    {
      provide: 'NotificationGateway',
      useExisting: NotificationGateway
    }
  ],
  exports: ['NotificationGateway', JwtModule],
})
export class NotificationsModule {}
