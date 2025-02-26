import { Injectable, BadRequestException } from '@nestjs/common';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class AdminService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll() {
    try {
      const admins = await this.knex('admin')
        .select(['id', 'username', 'email', 'role', 'created_at', 'updated_at'])
        .orderBy('created_at', 'desc');

      if (!admins || admins.length === 0) {
        return {
          status: 200,
          message: 'No admins found',
          data: [],
        };
      }

      return {
        status: 200,
        message: 'Admins retrieved successfully',
        data: admins,
      };
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: 'Failed to retrieve admins',
        error: error.message,
      });
    }
  }

  async create(createAdminDto: CreateAdminDto) {
    try {
      const existingUsername = await this.knex('admin')
        .where('username', createAdminDto.username)
        .first();

      if (existingUsername) {
        throw new BadRequestException({
          status: 400,
          message: 'Username already exists',
          error: 'Bad Request',
        });
      }

      const existingEmail = await this.knex('admin')
        .where('email', createAdminDto.email)
        .first();

      if (existingEmail) {
        throw new BadRequestException({
          status: 400,
          message: 'Email already exists',
          error: 'Bad Request',
        });
      }

      const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
      const [admin] = await this.knex('admin')
        .insert({
          ...createAdminDto,
          role: 'admin',
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning('*');

      return {
        status: 201,
        message: 'Admin created successfully',
        data: admin,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException({
        status: 400,
        message: 'Failed to create admin',
        error: error.message,
      });
    }
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid ID');
    }

    return this.knex('admin').where({ id }).first();
  }

  async findByUsername(username: string) {
    return this.knex('admin').where({ username }).first();
  }

  async findByUsernameOrEmail(username: string, email: string) {
    return this.knex('admin')
      .where('username', username)
      .orWhere('email', email)
      .first();
  }

  async update(id: string, updateData: Partial<CreateAdminDto>) {
    if (!id) {
      throw new BadRequestException('Invalid ID');
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const [updated] = await this.knex('admin')
      .where({ id })
      .update({
        ...updateData,
        updated_at: new Date(),
      })
      .returning('*');

    return updated;
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid ID');
    }
    await this.knex('admin').where({ id }).delete();
  }

  async isSuperAdmin(id: number): Promise<boolean> {
    const admin = await this.findOne(id.toString());
    return admin ? true : false;
  }
}
