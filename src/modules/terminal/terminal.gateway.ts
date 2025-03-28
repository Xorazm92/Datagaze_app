
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as SSH2Promise from 'ssh2-promise';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'https://datagaze-front.vercel.app'],
    credentials: true
  }
})
export class TerminalGateway {
  private connections = new Map<string, SSH2Promise>();

  @SubscribeMessage('connect_ssh')
  async handleConnection(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const ssh = new SSH2Promise({
        host: data.host,
        port: data.port,
        username: data.username,
        password: data.password
      });

      await ssh.connect();
      this.connections.set(client.id, ssh);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('execute_command')
  async handleCommand(
    @MessageBody() data: { command: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const ssh = this.connections.get(client.id);
      if (!ssh) {
        throw new Error('No SSH connection');
      }

      const result = await ssh.exec(data.command);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
