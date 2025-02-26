import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import * as crypto from 'crypto';
import * as SSH2 from 'ssh2';
import { ConnectConfig } from 'ssh2';

@Injectable()
export class SSHService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = crypto.scryptSync(process.env.SSH_ENCRYPTION_KEY || 'your-secret-key', 'salt', 32);
  private readonly iv = crypto.randomBytes(16);

  constructor(@InjectConnection() private readonly knex: Knex) {}

  private encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async connect(serverData: any, userId: string) {
    try {
      // Create SSH connection config
      const config: ConnectConfig = {
        host: serverData.ip,
        port: serverData.port || 22,
        username: serverData.username,
      };

      if (serverData.auth_type === 'password') {
        config.password = serverData.password;
      } else {
        config.privateKey = serverData.private_key;
        if (serverData.passphrase) {
          config.passphrase = serverData.passphrase;
        }
      }

      // Create new session
      const [session] = await this.knex('ssh_sessions')
        .insert({
          server_id: serverData.server_id,
          user_id: userId,
          status: 'active',
        })
        .returning('*');

      // Create SSH connection
      const conn = new SSH2.Client();

      return new Promise((resolve, reject) => {
        conn.on('ready', () => {
          // Log successful connection
          this.logConnection(serverData.server_id, userId, 'success');
          resolve({
            status: 'success',
            message: 'Connected successfully',
            session_id: session.id,
          });
        });

        conn.on('error', (err) => {
          // Log failed connection
          this.logConnection(serverData.server_id, userId, 'failed', err.message);
          reject({
            status: 'error',
            message: err.message,
          });
        });

        conn.connect(config);
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async checkStatus(serverId: string) {
    const server = await this.knex('ssh_servers')
      .where({ id: serverId })
      .first();

    if (!server) {
      throw new NotFoundException('Server not found');
    }

    try {
      const config: ConnectConfig = {
        host: server.ip_address,
        port: server.port || 22,
        username: server.username,
      };

      if (server.auth_type === 'password') {
        config.password = this.decrypt(server.password);
      } else {
        config.privateKey = this.decrypt(server.private_key);
        if (server.passphrase) {
          config.passphrase = this.decrypt(server.passphrase);
        }
      }

      const conn = new SSH2.Client();

      return new Promise((resolve, reject) => {
        conn.on('ready', () => {
          conn.end();
          // Update server status
          this.knex('ssh_servers')
            .where({ id: serverId })
            .update({
              status: 'online',
              last_checked: this.knex.fn.now(),
            });

          resolve({
            status: 'success',
            server_id: serverId,
            ssh_status: 'online',
            last_checked: new Date(),
          });
        });

        conn.on('error', () => {
          // Update server status
          this.knex('ssh_servers')
            .where({ id: serverId })
            .update({
              status: 'offline',
              last_checked: this.knex.fn.now(),
            });

          reject({
            status: 'error',
            message: 'SSH service is not running on the target server',
          });
        });

        conn.connect(config);
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async getErrors(serverId: string) {
    const errors = await this.knex('ssh_connection_logs')
      .where({
        server_id: serverId,
        status: 'failed',
      })
      .orderBy('created_at', 'desc')
      .limit(5)
      .select('created_at', 'error_message');

    return {
      status: 'success',
      errors: errors.map((error) => ({
        timestamp: error.created_at,
        error_message: error.error_message,
      })),
    };
  }

  async storeCredentials(serverData: any) {
    try {
      const data: any = {
        name: serverData.name,
        ip_address: serverData.ip,
        port: serverData.port || 22,
        username: serverData.username,
        auth_type: serverData.auth_type,
      };

      if (serverData.auth_type === 'password') {
        data.password = this.encrypt(serverData.password);
      } else {
        data.private_key = this.encrypt(serverData.private_key);
        if (serverData.passphrase) {
          data.passphrase = this.encrypt(serverData.passphrase);
        }
      }

      await this.knex('ssh_servers').insert(data);

      return {
        status: 'success',
        message: 'SSH credentials stored securely',
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private async logConnection(serverId: string, userId: string, status: 'success' | 'failed', errorMessage?: string) {
    await this.knex('ssh_connection_logs').insert({
      server_id: serverId,
      user_id: userId,
      status,
      error_message: errorMessage,
    });
  }
}
