import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  
  return knex.schema.createTable('admin', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('username').unique().notNullable();
    table.string('email').unique().notNullable();
    table.string('name').nullable();
    table.string('password').notNullable();
    table.enum('status', ['active', 'inactive']).defaultTo('active');
    table.enum('role', ['admin', 'super_admin']).defaultTo('admin');
    table.timestamp('last_login').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indekslar
    table.index(['username', 'email', 'role']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('admin');
} 