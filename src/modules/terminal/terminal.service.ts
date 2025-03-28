
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
    return await ssh.exec(command);
  }
}
