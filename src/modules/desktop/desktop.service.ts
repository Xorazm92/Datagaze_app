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
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class DesktopService {
  private webApplications: WebApplicationEntity[];
  private webApplicationDetails: { [key: string]: WebApplicationDetailsEntity };

  constructor() {
    try {
      const webAppsPath = join(process.cwd(), 'public/assets/web-applications.json');
      const webAppDetailsPath = join(process.cwd(), 'public/assets/web-application-details.json');

      this.webApplications = JSON.parse(readFileSync(webAppsPath, 'utf-8'));
      this.webApplicationDetails = JSON.parse(readFileSync(webAppDetailsPath, 'utf-8'));
    } catch (error) {
      throw new InternalServerErrorException('Failed to load web applications data');
    }
  }

  // findAllWebApplications(): WebApplicationEntity[] {
  //   try {
  //     return this.webApplications;
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Failed to fetch web applications',
  //     );
  //   }
  // }

  findAllWebApplications(): WebApplicationEntity[] {
    return this.webApplications.map(app => ({
      ...app,
      title: app.application_name,
      img: app.pathToIcon,
      License_count: 1, // bu yerda to'g'ri qiymatni olish kerak
      Agent_version: app.version,
      adress: "127.0.0.1", // bu yerda to'g'ri IP olish kerak
      File_size: 1, // bu yerda to'g'ri fayl hajmi olish kerak
      First_upload_date: "2024-01-01",
      Last_upload_date: "2024-01-01"
    }));
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
