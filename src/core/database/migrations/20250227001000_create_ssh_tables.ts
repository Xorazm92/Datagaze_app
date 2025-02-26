import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // SSH Servers table
  await knex.schema.createTable('ssh_servers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('ip_address').notNullable();
    table.integer('port').defaultTo(22);
    table.string('username').notNullable();
    table.enum('auth_type', ['password', 'key']).notNullable();
    table.text('password').nullable();
    table.text('private_key').nullable();
    table.text('passphrase').nullable();
    table.enum('status', ['online', 'offline', 'unknown']).defaultTo('unknown');
    table.timestamp('last_checked').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // SSH Connection Logs table
  await knex.schema.createTable('ssh_connection_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('server_id').references('id').inTable('ssh_servers').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('admin').onDelete('SET NULL');
    table.enum('status', ['success', 'failed']).notNullable();
    table.text('error_message').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // SSH Sessions table
  await knex.schema.createTable('ssh_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('server_id').references('id').inTable('ssh_servers').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('admin').onDelete('SET NULL');
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('ended_at').nullable();
    table.enum('status', ['active', 'closed', 'error']).defaultTo('active');
    table.text('error_message').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ssh_sessions');
  await knex.schema.dropTable('ssh_connection_logs');
  await knex.schema.dropTable('ssh_servers');
}
