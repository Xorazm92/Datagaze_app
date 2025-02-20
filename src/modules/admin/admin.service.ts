import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nest-knexjs';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto, AdminRole } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const [admin] = await this.knex('admin')
      .insert({
        ...createAdminDto,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');
    return admin;
  }

  async findAll() {
    return this.knex('admin').select('*');
  }

  async findOne(id: string) {
    return this.knex('admin').where({ id }).first();
  }

  async update(id: string, updateData: Partial<CreateAdminDto>) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const [updated] = await this.knex('admin')
      .where({ id })
      .update({ ...updateData, updated_at: new Date() })
      .returning('*');
    return updated;
  }

  async remove(id: string) {
    await this.knex('admin').where({ id }).delete();
  }

  async isSuperAdmin(id: string): Promise<boolean> {
    const admin = await this.findOne(id);
    return admin?.role === AdminRole.SUPER_ADMIN;
  }
}