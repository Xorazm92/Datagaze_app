import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto, AdminRole } from './dto/create-admin.dto';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class AdminService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll() {
    return this.knex('admin').select('*');
  }

  async create(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const [admin] = await this.knex('admin')
      .insert({
        ...createAdminDto,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return admin;
  }

  async findOne(id: number) {
    return this.knex('admin').where({ id }).first();
  }

  async findByUsername(username: string) {
    return this.knex('admin').where({ username }).first();
  }

  async update(id: number, updateData: Partial<CreateAdminDto>) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const [updated] = await this.knex('admin')
      .where({ id })
      .update({ ...updateData, updated_at: new Date() })
      .returning('*');
    return updated;
  }

  async remove(id: number) {
    await this.knex('admin').where({ id }).delete();
  }

  async isSuperAdmin(id: number): Promise<boolean> {
    const admin = await this.findOne(id);
    return admin? true: false;
  }
}
