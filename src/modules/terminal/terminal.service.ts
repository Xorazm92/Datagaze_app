
import { Injectable } from '@nestjs/common';
import * as SSH2Promise from 'ssh2-promise';

@Injectable()
export class TerminalService {
  private sshConnections = new Map();

  async connectToSSH(serverData: {
    host: string;
    port: number;
    username: string;
    password: string;
  }): Promise<string> {
    const connection = new Client();
    
    try {
      await connection.connect({
        host: serverData.host,
        port: serverData.port,
        username: serverData.username,
        password: serverData.password
      });

      const sessionId = Math.random().toString(36).substring(7);
      this.sshConnections.set(sessionId, connection);
      
      return sessionId;
    } catch (error) {
      throw new Error(`SSH Connection failed: ${error.message}`);
    }
  }

  async executeCommand(sessionId: string, command: string): Promise<string> {
    const connection = this.sshConnections.get(sessionId);
    if (!connection) {
      throw new Error('SSH session not found');
    }

    return new Promise((resolve, reject) => {
      connection.exec(command, (err, stream) => {
        if (err) reject(err);
        
        let output = '';
        stream.on('data', (data) => {
          output += data.toString();
        });
        
        stream.on('end', () => {
          resolve(output);
        });
      });
    });
  }
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
