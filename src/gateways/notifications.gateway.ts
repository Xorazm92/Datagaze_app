import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Production muhitida o'zgartiring
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  // Yangi client ulanganda
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  // Client uzilganda
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  // Client tomonidan yuborilgan xabarni qabul qilish
  @SubscribeMessage('sendNotification')
  handleNotification(client: Socket, payload: any): void {
    console.log(`Received notification from ${client.id}:`, payload);
    // Barcha clientlarga xabarni yuborish
    this.server.emit('notification', {
      senderId: client.id,
      ...payload,
    });
  }

  // Ma'lum bir clientga xabar yuborish
  sendToClient(clientId: string, event: string, data: any): void {
    const client = this.connectedClients.get(clientId);
    if (client) {
      client.emit(event, data);
    }
  }

  // Barcha clientlarga xabar yuborish
  broadcastNotification(event: string, data: any): void {
    this.server.emit(event, data);
  }
}
