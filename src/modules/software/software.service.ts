import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { CreateSoftwareDto, UpdateSoftwareDto } from './dto/software.dto';

@Injectable()
export class SoftwareService {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async findAll() {
    const software = await this.knex('software_inventory')
      .select('*')
      .orderBy('created_at', 'desc');

    return {
      status: 'success',
      data: software
    };
  }

  async findOne(id: string) {
    const software = await this.knex('software_inventory')
      .select('*')
      .where({ id })
      .first();

    return {
      status: 'success',
      data: software
    };
  }

  async create(createSoftwareDto: CreateSoftwareDto) {
    const [software] = await this.knex('software_inventory')
      .insert(createSoftwareDto)
      .returning('*');

    return {
      status: 'success',
      data: software
    };
  }

  async update(id: string, updateSoftwareDto: UpdateSoftwareDto) {
    const [software] = await this.knex('software_inventory')
      .where({ id })
      .update(updateSoftwareDto)
      .returning('*');

    return {
      status: 'success',
      data: software
    };
  }

  async remove(id: string) {
    await this.knex('software_inventory')
      .where({ id })
      .del();

    return {
      status: 'success',
      message: 'Software removed successfully'
    };
  }
}
