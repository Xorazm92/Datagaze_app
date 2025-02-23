import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import {
  InstallApplicationDto,
  UpdateApplicationDto,
  RemoveApplicationDto,
} from './dto/computer.dto';

@Injectable()
export class ComputersService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async getAllComputers() {
    try {
      const computers = await this.knex('computers').select(
        'id',
        'hostname',
        'ip_address',
        'status',
        'last_seen',
      );

      return {
        status: 'success',
        data: computers,
      };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'Internal server error. Please try again later.',
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
