
import { Injectable } from '@nestjs/common';
import * as SSH2Promise from 'ssh2-promise';

@Injectable()
export class TerminalService {
  private connections = new Map<string, SSH2Promise>();

  async connect(connectionData: any): Promise<SSH2Promise> {
    const ssh = new SSH2Promise({
      host: connectionData.host,
      port: connectionData.port || 22,
      username: connectionData.username,
      password: connectionData.password
    });

    await ssh.connect();
    return ssh;
  }

  async executeCommand(ssh: SSH2Promise, command: string): Promise<string> {
    try {
      const result = await ssh.exec(command);
      return result;
    } catch (error) {
      throw new Error(`Command execution failed: ${error.message}`);
    }
  }

  async getCommandHistory(connectionId: string): Promise<string[]> {
    // Implementation for command history
    return [];
  }

  async disconnect(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (connection) {
      await connection.close();
      this.connections.delete(connectionId);
    }
  }
}
