import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Client } from 'ssh2';

interface SSHConnectionDto {
  host: string;
  username: string;
  password: string;
  port?: number;
}

interface SSHSession {
  client: Client;
  stream?: any;
}

@WebSocketGateway({
  namespace: 'terminal',
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://datagaze-front.vercel.app'],
    credentials: true
  }
})
export class TerminalGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private sshSessions = new Map<string, SSHSession>();

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const session = this.sshSessions.get(client.id);
    if (session) {
      if (session.stream) {
        session.stream.end();
      }
      session.client.end();
      this.sshSessions.delete(client.id);
    }
  }

  @SubscribeMessage('ssh:connect')
  async handleSSHConnect(@ConnectedSocket() client: Socket, @MessageBody() data: SSHConnectionDto) {
    try {
      const ssh = new Client();

      await new Promise<void>((resolve, reject) => {
        ssh.on('ready', () => {
          this.sshSessions.set(client.id, { client: ssh });
          client.emit('ssh:connected');
          resolve();
        });

        ssh.on('error', (err) => {
          reject(err);
        });

        ssh.connect({
          host: data.host,
          port: data.port || 22,
          username: data.username,
          password: data.password
        });
      });
    } catch (error) {
      client.emit('ssh:error', error.message);
    }
  }

  @SubscribeMessage('ssh:execute')
  async handleCommand(@ConnectedSocket() client: Socket, @MessageBody() command: string) {
    const session = this.sshSessions.get(client.id);
    if (!session) {
      client.emit('ssh:error', 'No active SSH connection');
      return;
    }

    try {
      session.client.exec(command, (err, stream) => {
        if (err) {
          client.emit('ssh:error', err.message);
          return;
        }

        session.stream = stream;
        let output = '';

        stream.on('data', (data: Buffer) => {
          output += data.toString();
          client.emit('ssh:output', { data: data.toString() });
        });

        stream.stderr.on('data', (data: Buffer) => {
          client.emit('ssh:error', data.toString());
        });

        stream.on('close', () => {
          client.emit('ssh:commandComplete', { output });
        });
      });
    } catch (error) {
      client.emit('ssh:error', error.message);
    }
  }
}