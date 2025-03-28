import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as SSH2Promise from 'ssh2-promise';
import { Server, Socket as NetSocket } from 'net'; //added for type consistency
import { NodeSSH } from 'node-ssh';


interface SSHConnectionDto {
  host: string;
  username: string;
  password: string;
  port?: number;
}

@WebSocketGateway({
  namespace: 'terminal',
  cors: {
    origin: '*',
    credentials: true
  }
})
export class TerminalGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private sshSessions = new Map<string, NodeSSH>();
  private connections = new Map<string, SSH2Promise>(); //Keeping original for compatibility, might need refactoring

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const ssh = this.sshSessions.get(client.id);
    if (ssh) {
      await ssh.dispose();
      this.sshSessions.delete(client.id);
    }
    const ssh2 = this.connections.get(client.id);
    if (ssh2) {
      await ssh2.close();
      this.connections.delete(client.id);
    }
  }

  @SubscribeMessage('ssh:connect')
  async handleSSHConnect(client: Socket, data: SSHConnectionDto) {
    try {
      const ssh = new NodeSSH();
      await ssh.connect({
        host: data.host,
        username: data.username,
        password: data.password,
        port: data.port || 22,
      });
      this.sshSessions.set(client.id, ssh);
      client.emit('ssh:connected');
    } catch (error) {
      client.emit('ssh:error', error.message);
    }
  }

  @SubscribeMessage('ssh:execute')
  async handleCommand(client: Socket, command: string) {
    const ssh = this.sshSessions.get(client.id);
    if (!ssh) {
      client.emit('ssh:error', 'No active SSH connection');
      return;
    }

    try {
      const result = await ssh.execCommand(command);
      client.emit('ssh:output', {
        stdout: result.stdout,
        stderr: result.stderr,
      });
    } catch (error) {
      client.emit('ssh:error', error.message);
    }
  }

  //Original Code (using ssh2-promise) remains for potential compatibility
  @SubscribeMessage('connect_ssh')
  async handleConnection2(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
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
  async handleCommand2(
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
  async handleDisconnect2(@ConnectedSocket() client: Socket) {
    const ssh = this.connections.get(client.id);
    if (ssh) {
      await ssh.close();
      this.connections.delete(client.id);
    }
  }
}