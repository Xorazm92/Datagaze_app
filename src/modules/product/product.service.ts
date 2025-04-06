import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { SystemRequirementsDto } from './dto/system-requirements.dto';
import { InstallationScriptDto } from './dto/installation-script.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
  ) {}
  async addSystemRequirements(productId: string, requirements: SystemRequirementsDto) {
    const product = await this.knex('products')
      .where('id', productId)
      .first();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.knex('products')
      .where('id', productId)
      .update({
        system_requirements: requirements,
        updated_at: new Date()
      });

    return this.knex('products')
      .where('id', productId)
      .first();
  }

  async addInstallationScript(productId: string, script: InstallationScriptDto) {
    const product = await this.knex('products')
      .where('id', productId)
      .first();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.knex('products')
      .where('id', productId)
      .update({
        installation_script: script,
        updated_at: new Date()
      });

    return this.knex('products')
      .where('id', productId)
      .first();
  }
}