import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { ComputerEntity } from '@computers/dto/computer.entity';
import { ComputerResponseDetailsEntity } from '@computers/dto/computer-response-details.entity';
import { ComputerAppEntity } from '@computers/dto/computer-app.entity';
import {
  InstallApplicationDto,
  UpdateApplicationDto,
  RemoveApplicationDto,
} from '@computers/dto/computer.dto';

@Injectable()
export class ComputersService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async getAllComputers(
    page: number = 1,
    limit: number = 10,
    status?: 'active' | 'inactive',
  ): Promise<ComputerEntity[]> {
    try {
      const query = this.knex('computers').select('*');

      if (status) {
        query.where('status', status);
      }

      const offset = (page - 1) * limit;
      const computers = await query.offset(offset).limit(limit);

      return computers.map((computer) => ({
        id: computer.id,
        computer_name: computer.computer_name,
        os: computer.os,
        ip_address: computer.ip_address,
        status: computer.status,
      }));
    } catch (error: unknown) {
      console.error('Error fetching computers:', error);
      throw new InternalServerErrorException('Failed to fetch computers');
    }
  }

  async getComputerById(id: string): Promise<ComputerResponseDetailsEntity> {
    try {
      const computer = await this.knex('computers').where('id', id).first();

      if (!computer) {
        throw new NotFoundException(`Computer with ID ${id} not found`);
      }

      // Mock data for demonstration
      return {
        id: computer.id,
        os_details: {
          os: computer.os,
          platform: 'Windows',
          build_number: '19045',
          version: '10.0',
        },
        processor_details: {
          cpu: 'Intel Core i7',
          core: '8 cores',
          generation: '12th Gen',
        },
        network_details: [
          {
            nic_name: 'Ethernet',
            ip_address: computer.ip_address,
            mac_address: '00:1B:44:11:3A:B7',
            available: 'Yes',
            type: 'Wired',
          },
        ],
        memory_storage_details: {
          ram: '16 GB',
          drives: [
            {
              drive_name: 'C:',
              total_size: '256 GB',
              free_size: '128 GB',
            },
          ],
        },
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching computer details:', error);
      throw new InternalServerErrorException(
        'Failed to fetch computer details',
      );
    }
  }

  async getComputerApps(id: string): Promise<ComputerAppEntity[]> {
    try {
      const computer = await this.knex('computers').where('id', id).first();

      if (!computer) {
        throw new NotFoundException(`Computer with ID ${id} not found`);
      }

      // Mock data for demonstration
      return [
        {
          id: '6c8f35c8-f578-40a2-9723-6fcec8765a7e',
          name: 'Slack',
          file_size: '128 MB',
          installation_type: 'user',
          installed_date: '2023-10-04T19:00:00.000Z',
        },
        {
          id: '7d9e0f1a-b2c3-4d5e-6f7g-8h9i0j1k2l3m',
          name: 'Chrome',
          file_size: '256 MB',
          installation_type: 'system',
          installed_date: '2023-10-04T19:00:00.000Z',
        },
      ];
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching computer applications:', error);
      throw new InternalServerErrorException(
        'Failed to fetch computer applications',
      );
    }
  }

  async getInstalledApplications(computerId: string) {
    const computer = await this.knex('computers')
      .where('id', computerId)
      .first();

    if (!computer) {
      throw new NotFoundException('Computer not found.');
    }

    const applications = await this.knex('installations')
      .join('applications', 'installations.application_id', 'applications.id')
      .where('installations.computer_id', computerId)
      .select(
        'applications.id as app_id',
        'applications.name',
        'installations.version',
        'installations.install_date',
      );

    return {
      status: 'success',
      data: applications,
    };
  }

  async installApplication(computerId: string, dto: InstallApplicationDto) {
    const computer = await this.knex('computers')
      .where('id', computerId)
      .first();

    if (!computer) {
      throw new NotFoundException('Computer not found.');
    }

    if (computer.status === 'inactive') {
      throw new BadRequestException(
        'The selected computer is offline. Installation cannot proceed.',
      );
    }

    try {
      // Validate installer URL
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(dto.installer_url)) {
        throw new UnprocessableEntityException(
          'Invalid installer URL provided.',
        );
      }

      // Create application record if it doesn't exist
      const [application] = await this.knex('applications')
        .insert({
          name: dto.app_name,
          version: dto.version,
          installer_url: dto.installer_url,
          status: 'active',
        })
        .returning('*');

      // Create installation record
      await this.knex('installations').insert({
        computer_id: computerId,
        application_id: application.id,
        version: dto.version,
        install_date: this.knex.fn.now(),
        status: 'installing',
      });

      return {
        status: 'success',
        message: 'Installation initiated successfully.',
        task_id: `task-${Date.now()}`,
      };
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to initiate installation. Please try again.',
      );
    }
  }

  async updateApplication(computerId: string, dto: UpdateApplicationDto) {
    const installation = await this.knex('installations')
      .join('applications', 'installations.application_id', 'applications.id')
      .where({
        'installations.computer_id': computerId,
        'applications.id': dto.app_id,
      })
      .first();

    if (!installation) {
      throw new NotFoundException(
        'Application not found on the target computer.',
      );
    }

    try {
      // Validate update URL
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(dto.update_url)) {
        throw new BadRequestException(
          'Failed to download update from the provided URL.',
        );
      }

      await this.knex('installations')
        .where({
          computer_id: computerId,
          application_id: dto.app_id,
        })
        .update({
          version: dto.new_version,
          status: 'updating',
        });

      return {
        status: 'success',
        message: 'Update process started successfully.',
        task_id: `task-${Date.now()}`,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to initiate update. Please try again.',
      );
    }
  }

  async removeApplication(computerId: string, dto: RemoveApplicationDto) {
    const installation = await this.knex('installations')
      .where({
        computer_id: computerId,
        application_id: dto.app_id,
      })
      .first();

    if (!installation) {
      throw new NotFoundException(
        'The specified application was not found on the computer.',
      );
    }

    try {
      await this.knex('installations')
        .where({
          computer_id: computerId,
          application_id: dto.app_id,
        })
        .update({
          status: 'removing',
        });

      return {
        status: 'success',
        message: 'Application removal started successfully.',
        task_id: `task-${Date.now()}`,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to remove the application due to a system error.',
      );
    }
  }
}
