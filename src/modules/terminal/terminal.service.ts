
import { Injectable } from '@nestjs/common';
import SSH2Promise from 'ssh2-promise';
import { Client, ConnectConfig } from 'ssh2';

export interface SSHConnectionData {
  host: string;
  port: number;
  username: string;
  password: string;
}

@Injectable()
export class TerminalService {
  private connections = new Map<string, SSH2Promise>();

  async connect(connectionData: SSHConnectionData): Promise<string> {
    const config: ConnectConfig = {
      debug: console.log,
      host: connectionData.host,
      port: connectionData.port || 22,
      username: connectionData.username,
      password: connectionData.password
    };

    const ssh = new SSH2Promise(config);

    try {
      await ssh.connect();
      const sessionId = Math.random().toString(36).substring(7);
      this.connections.set(sessionId, ssh);
      return sessionId;
    } catch (error) {
      throw new Error(`SSH Connection failed: ${error.message}`);
    }
  }

  async executeCommand(sessionId: string, command: string): Promise<string> {
    const connection = this.connections.get(sessionId);
    if (!connection) {
      throw new Error('SSH session not found');
    }

    try {
      const result = await connection.exec(command);
      return result;
    } catch (error) {
      throw new Error(`Command execution failed: ${error.message}`);
    }
  }

  async getCommandHistory(sessionId: string): Promise<string[]> {
    // Implementation for command history
    return [];
  }

  async disconnect(sessionId: string): Promise<void> {
    const connection = this.connections.get(sessionId);
    if (connection) {
      await connection.close();
      this.connections.delete(sessionId);
    }
  }
}
