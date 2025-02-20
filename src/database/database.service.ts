import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async runSeed() {
    const existingSuperAdmin = await this.knex('admin')
      .where({ username: 'superadmin' })
      .first();

    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash('superadmin', 10);

      await this.knex('admin').insert({
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        name: 'Super Admin',
        status: 'active',
        role: 'super_admin',
        created_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now()
      });
      
      console.log('Super admin created successfully');
    }
  }
} 