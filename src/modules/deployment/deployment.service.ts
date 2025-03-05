import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsGateway } from '../../gateways/notifications.gateway';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class DeploymentService {
  private readonly logger = new Logger(DeploymentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async installPackages(serverId: string, packages: string[]): Promise<any> {
    try {
      const pemPath = this.configService.get<string>('SSH_KEY_PATH');
      const serverHost = this.configService.get<string>('AWS_SERVER_HOST');
      const filesPath = path.join(process.cwd(), 'public', 'files');

      // WebSocket orqali jarayon boshlanganini bildirish
      this.notificationsGateway.broadcastNotification('installation_status', {
        serverId,
        status: 'started',
        message: 'Starting package installation...'
      });

      // Fayllarni yuklash
      const scpCommand = `scp -i "${pemPath}" ${filesPath}/*.deb ubuntu@${serverHost}:~`;
      await execAsync(scpCommand);

      // WebSocket orqali yuklash tugaganini bildirish
      this.notificationsGateway.broadcastNotification('installation_status', {
        serverId,
        status: 'uploading_complete',
        message: 'Files uploaded successfully'
      });

      // Har bir paketni o'rnatish
      for (const pkg of packages) {
        const installCommand = `ssh -i "${pemPath}" ubuntu@${serverHost} "sudo dpkg -i ~/${pkg}.deb"`;
        
        this.notificationsGateway.broadcastNotification('installation_status', {
          serverId,
          status: 'installing',
          package: pkg,
          message: `Installing ${pkg}...`
        });

        await execAsync(installCommand);

        this.notificationsGateway.broadcastNotification('installation_status', {
          serverId,
          status: 'package_installed',
          package: pkg,
          message: `${pkg} installed successfully`
        });
      }

      // Bog'liqliklarni o'rnatish
      const fixDepsCommand = `ssh -i "${pemPath}" ubuntu@${serverHost} "sudo apt-get install -f -y"`;
      await execAsync(fixDepsCommand);

      this.notificationsGateway.broadcastNotification('installation_status', {
        serverId,
        status: 'completed',
        message: 'All packages installed successfully'
      });

      return { success: true };
    } catch (error) {
      this.logger.error('Installation failed:', error);
      
      this.notificationsGateway.broadcastNotification('installation_status', {
        serverId,
        status: 'error',
        message: error.message
      });

      throw error;
    }
  }
}
