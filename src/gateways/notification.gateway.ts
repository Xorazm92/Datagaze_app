import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  broadcastNotification(arg0: string, arg1: { serverId: string; status: string; message: string; }) {
    throw new Error('Method not implemented.');
  }
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
      
      // Join room based on user role
      client.join(`role_${payload.role}`);
      
      client.emit('connection_status', {
        status: 'connected',
        message: 'Successfully connected to notification service'
      });
    } catch (error) {
      client.emit('error', {
        message: 'Authentication failed'
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    client.emit('connection_status', {
      status: 'disconnected',
      message: 'Disconnected from notification service'
    });
  }

  // Emit to specific roles
  emitToRole(role: string, event: string, data: any) {
    this.server.to(`role_${role}`).emit(event, data);
  }

  // Emit to all clients
  emit(event: string, data: any) {
    this.server.emit(event, data);
  }
}
