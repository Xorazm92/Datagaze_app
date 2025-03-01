import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Computers table
  await knex.schema.createTable('computers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('ip_address').notNullable();
    table.string('mac_address').notNullable();
    table.string('os_type').notNullable();
    table.string('os_version').notNullable();
    table.enum('status', ['online', 'offline', 'maintenance']).defaultTo('offline');
    table.timestamp('last_seen').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Installed Applications table
  await knex.schema.createTable('installed_applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('computer_id').references('id').inTable('computers').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('version').notNullable();
    table.timestamp('install_date').notNullable();
    table.string('license_key').nullable();
    table.enum('status', ['active', 'inactive', 'expired']).defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Computer Monitoring Logs table
  await knex.schema.createTable('computer_monitoring_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('computer_id').references('id').inTable('computers').onDelete('CASCADE');
    table.float('cpu_usage').notNullable();
    table.float('memory_usage').notNullable();
    table.float('disk_usage').notNullable();
    table.integer('network_speed').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('computer_monitoring_logs');
  await knex.schema.dropTable('installed_applications');
  await knex.schema.dropTable('computers');
}
