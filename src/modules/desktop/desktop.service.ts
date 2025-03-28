import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DesktopConnectionDto, CreateWebApplicationDto } from './dto/desktop-connection.dto';

interface WebApplication {
  id: string;
  applicationName: string;
  webVersion: string;
  pathToIcon: string;
  isInstalled: boolean;
  publisher?: string;
  releaseDate?: string;
  cpu?: string;
  ram?: string;
  storage?: string;
  networkBandwidth?: string;
}

@Injectable()
export class DesktopService {
  private webApplications: WebApplication[] = [
    {
      id: '832f6fa7-dad4-430a-9206-5fb118d36f26',
      applicationName: 'DLP',
      webVersion: '4.7.2',
      pathToIcon: '/dlp.png',
      isInstalled: false,
      publisher: 'Datagaze LLC',
      releaseDate: '05.10.2023',
      cpu: '2-cores',
      ram: '2 GB',
      storage: '64 GB SSD',
      networkBandwidth: '100 Mbps Ethernet Port',
    },
    {
      id: '18903dfc-0903-4423-a620-8fa8e9e8663e',
      applicationName: 'WAF',
      webVersion: '2.1.0',
      pathToIcon: '/waf.png',
      isInstalled: true,
      publisher: 'Datagaze LLC',
      releaseDate: '02.12.2022',
      cpu: '2-cores',
      ram: '4 GB',
      storage: '128 GB SSD',
      networkBandwidth: '1 Gbps Ethernet Port',
    },
  ];

  findAllWebApplications(): WebApplication[] {
    try {
      return this.webApplications.map(({ id, applicationName, webVersion, pathToIcon, isInstalled }) => ({
        id,
        applicationName,
        webVersion,
        pathToIcon,
        isInstalled,
      }));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch web applications');
    }
  }

  findWebApplicationById(id: string): WebApplication {
    try {
      const webApp = this.webApplications.find((app) => app.id === id);
      if (!webApp) {
        throw new NotFoundException(`Web Application with ID ${id} not found`);
      }
      return webApp;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch web application details');
    }
  }

  async installWebApplication(id: string, connectionDto: DesktopConnectionDto): Promise<void> {
    try {
      const webApp = this.webApplications.find((app) => app.id === id);
      if (!webApp) {
        throw new NotFoundException(`Web Application with ID ${id} not found`);
      }
      webApp.isInstalled = true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to install web application');
    }
  }

  async uninstallWebApplication(id: string): Promise<void> {
    try {
      const webApp = this.webApplications.find((app) => app.id === id);
      if (!webApp) {
        throw new NotFoundException(`Web Application with ID ${id} not found`);
      }
      webApp.isInstalled = false;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to uninstall web application');
    }
  }

  async createWebApplication(createDto: CreateWebApplicationDto, files: any): Promise<{ status: string; message: string }> {
    try {
      const newWebApp: WebApplication = {
        id: uuidv4(),
        applicationName: createDto.applicationName,
        webVersion: createDto.webVersion,
        pathToIcon: files.icon ? `/uploads/${files.icon[0].filename}` : '/default-icon.png',
        isInstalled: false,
        publisher: createDto.publisher,
      };
      this.webApplications.push(newWebApp);
      return { status: 'success', message: 'Web application created successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create web application');
    }
  }

  async transferWebApplication(id: string, connectionDto: DesktopConnectionDto): Promise<void> {
    try {
      const webApp = this.webApplications.find((app) => app.id === id);
      if (!webApp) {
        throw new NotFoundException(`Web Application with ID ${id} not found`);
      }
      // Implementation for transfer logic would go here
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to transfer web application');
    }
  }
}

@Injectable()
export class DesktopService2 {
  private desktops: DesktopEntity[] = [];

  async connect(connectionDto: DesktopConnectionDto): Promise<DesktopEntity> {
    // Implementation for desktop connection
    const desktop = new DesktopEntity();
    desktop.id = Date.now().toString();
    desktop.name = `Desktop-${desktop.id}`;
    desktop.is_connected = true;
    desktop.ip_address = connectionDto.host;
    desktop.os = 'Windows 10'; // This should be detected
    desktop.last_connected = new Date();

    this.desktops.push(desktop);
    return desktop;
  }

  async findAll(): Promise<DesktopEntity[]> {
    return this.desktops;
  }

  async findOne(id: string): Promise<DesktopEntity> {
    return this.desktops.find(d => d.id === id);
  }

  async disconnect(id: string): Promise<void> {
    const desktop = this.desktops.find(d => d.id === id);
    if (desktop) {
      desktop.is_connected = false;
    }
  }

  async remove(id: string): Promise<void> {
    this.desktops = this.desktops.filter(d => d.id !== id);
  }
}