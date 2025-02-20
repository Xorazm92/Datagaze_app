import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Avval mavjud super admin borligini tekshiramiz
  const existingSuperAdmin = await knex('admin')
    .where({ username: 'superadmin' })
    .first();

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash('superadmin', 10);

    // Super admin yaratamiz
    await knex('admin').insert({
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      name: 'Super Admin',
      status: 'active',
      role: 'super_admin', // Bu ustunni migration'ga qo'shishimiz kerak
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });
  }
} 