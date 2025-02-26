import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { databaseConfig } from '../../../config/database.config';

async function seed() {
  const knex = require('knex')(databaseConfig);

  try {
    // Check if super admin already exists
    const existingAdmin = await knex('admin')
      .where({ username: 'Zufar92', role: 'super_admin' })
      .first();

    if (existingAdmin) {
      console.log('Super admin already exists');
      return;
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await knex('admin').insert({
      username: 'Zufar92',
      email: 'xorazm91@gmail.com',
      password: hashedPassword,
      role: 'super_admin',
    });

    console.log('Super admin created successfully');
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await knex.destroy();
  }
}

seed();
