
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as SSH2Promise from 'ssh2-promise';

@WebSocketGateway({
  namespace: 'terminal',
  cors: {
    origin: '*',
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
      
      client.emit('connected', { success: true });
      return { success: true };
    } catch (error) {
      client.emit('error', { message: error.message });
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
      client.emit('command_response', { success: true, result });
      return { success: true, result };
    } catch (error) {
      client.emit('command_response', { success: false, error: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const ssh = this.connections.get(client.id);
    if (ssh) {
      await ssh.close();
      this.connections.delete(client.id);
    }
  }
}
