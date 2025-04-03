import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // UUID extensionni yoqish
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // Admin jadvalini yaratish
  return knex.schema.createTable('admin', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); // UUID primary key
    table.string('fullname').notNullable(); // Full name
    table.string('username').unique().notNullable(); // Unique username
    table.string('email').unique().notNullable(); // Unique email
    table.string('password').notNullable(); // Hashed password
    table.enum('role', ['admin', 'super_admin', 'user']).defaultTo('admin'); // Role
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Created timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Updated timestamp
  });
}

export async function down(knex: Knex): Promise<void> {
  // Admin jadvalini o'chirish
  await knex.schema.dropTable('admin');
  return knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}