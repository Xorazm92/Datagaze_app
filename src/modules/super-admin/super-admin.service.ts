import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async updateAdminStatus(adminId: string, status: string) {
    const admin = await this.knex('admins')
      .where('id', adminId)
      .first();

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    await this.knex('admins')
      .where('id', adminId)
      .update({
        status: status,
        updated_at: new Date()
      });

    return this.knex('admins')
      .where('id', adminId)
      .first();
  }

  async deleteAdmin(adminId: string): Promise<void> {
    const deleted = await this.knex('admins')
      .where('id', adminId)
      .delete();

    if (!deleted) {
      throw new NotFoundException('Admin not found');
    }
  }
}