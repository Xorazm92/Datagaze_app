import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async updateStatus(id: string, status: string) {
    const application = await this.knex('installed_applications')
      .where('id', id)
      .first();

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    await this.knex('installed_applications')
      .where('id', id)
      .update({
        status: status,
        updated_at: new Date()
      });

    return this.knex('installed_applications')
      .where('id', id)
      .first();
  }

  async deleteApplication(id: string): Promise<void> {
    const deleted = await this.knex('installed_applications')
      .where('id', id)
      .delete();

    if (!deleted) {
      throw new NotFoundException('Application not found');
    }
  }
}
