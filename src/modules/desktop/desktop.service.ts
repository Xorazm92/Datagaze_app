import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  WebApplicationEntity,
  WebApplicationDetailsEntity,
} from './dto/desktop.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DesktopService {
  private webApplications: WebApplicationEntity[] = [
    {
      id: '832f6fa7-dad4-430a-9206-5fb118d36f26',
      application_name: 'DLP',
      version: '4.7.2',
      pathToIcon: '/dlp.png',
      is_installed: false,
    },
    {
      id: '18903dfc-0903-4423-a620-8fa8e9e8663e',
      application_name: 'WAF',
      version: '2.1.0',
      pathToIcon: '/waf.png',
      is_installed: true,
    },
  ];

  private webApplicationDetails: {
    [key: string]: WebApplicationDetailsEntity;
  } = {
    '832f6fa7-dad4-430a-9206-5fb118d36f26': {
      id: '832f6fa7-dad4-430a-9206-5fb118d36f26',
      application_name: 'DLP',
      version: '4.7.2',
      pathToIcon: '/dlp.png',
      is_installed: false,
      publisher: 'Datagaze LLC',
      release_date: '05.10.2023',
      cpu: '2-cores',
      ram: '2 GB',
      storage: '64 GB SSD',
      network_bandwidth: '100 Mbps Ethernet Port',
    },
    '18903dfc-0903-4423-a620-8fa8e9e8663e': {
      id: '18903dfc-0903-4423-a620-8fa8e9e8663e',
      application_name: 'WAF',
      version: '2.1.0',
      pathToIcon: '/waf.png',
      is_installed: true,
      publisher: 'Datagaze LLC',
      release_date: '02.12.2022',
      cpu: '2-cores',
      ram: '4 GB',
      storage: '128 GB SSD',
      network_bandwidth: '1 Gbps Ethernet Port',
    },
  };

  findAllWebApplications(): WebApplicationEntity[] {
    try {
      return this.webApplications;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch web applications',
      );
    }
  }

  findWebApplicationById(id: string): WebApplicationDetailsEntity {
    try {
      const webApp = this.webApplicationDetails[id];
      if (!webApp) {
        throw new NotFoundException(`Web Application with ID ${id} not found`);
      }
      return webApp;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch web application details',
      );
    }
  }

  async installWebApplication(id: string, credentials: any): Promise<void> {
    try {
      const webApp = this.webApplications.find((app) => app.id === id);
      if (!webApp) {
        throw new NotFoundException(`Web Application with ID ${id} not found`);
      }

      // Update installation status
      webApp.is_installed = true;
      if (this.webApplicationDetails[id]) {
        this.webApplicationDetails[id].is_installed = true;
      }

      // In a real application, you would use the SSH credentials to install the application
      // on the remote server

      return;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to install web application',
      );
    }
  }

  async uninstallWebApplication(id: string): Promise<void> {
    try {
      const webApp = this.webApplications.find((app) => app.id === id);
      if (!webApp) {
        throw new NotFoundException(`Web Application with ID ${id} not found`);
      }

      // Update installation status
      webApp.is_installed = false;
      if (this.webApplicationDetails[id]) {
        this.webApplicationDetails[id].is_installed = false;
      }

      // In a real application, you would connect to the remote server and uninstall the application

      return;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to uninstall web application',
      );
    }
  }
}
