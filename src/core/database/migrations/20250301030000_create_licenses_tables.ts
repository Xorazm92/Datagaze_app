import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Products table
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('vendor').notNullable();
    table.string('version').notNullable();
    table.enum('type', ['software', 'hardware']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Licenses table
  await knex.schema.createTable('licenses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.string('license_key').notNullable();
    table.enum('type', ['perpetual', 'subscription']).notNullable();
    table.integer('seats').notNullable();
    table.timestamp('start_date').notNullable();
    table.timestamp('expiry_date').nullable();
    table.enum('status', ['active', 'expired', 'revoked']).defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // License Assignments table
  await knex.schema.createTable('license_assignments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('license_id').references('id').inTable('licenses').onDelete('CASCADE');
    table.uuid('computer_id').references('id').inTable('computers').onDelete('CASCADE');
    table.uuid('assigned_by').references('id').inTable('admin').onDelete('SET NULL');
    table.timestamp('assigned_at').defaultTo(knex.fn.now());
    table.timestamp('revoked_at').nullable();
    table.string('revocation_reason').nullable();
  });

  // License Usage Logs table
  await knex.schema.createTable('license_usage_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('license_id').references('id').inTable('licenses').onDelete('CASCADE');
    table.uuid('computer_id').references('id').inTable('computers').onDelete('CASCADE');
    table.enum('action', ['activated', 'deactivated', 'exceeded']).notNullable();
    table.string('details').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('license_usage_logs');
  await knex.schema.dropTable('license_assignments');
  await knex.schema.dropTable('licenses');
  await knex.schema.dropTable('products');
}
