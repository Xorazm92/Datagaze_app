/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {

  return knex.schema
    // .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    // .createTable('admin', function (table) {
    //   table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    //   table.string('username').notNullable().unique();
    //   table.string('email').notNullable().unique();
    //   table.string('password').notNullable();
    //   table.enum('role', ['admin', 'super_admin']).defaultTo('admin');
    //   table.string('status').defaultTo('active');
    //   table.timestamp('last_login');
    //   table.timestamp('created_at').defaultTo(knex.fn.now());
    //   table.timestamp('updated_at').defaultTo(knex.fn.now());
    // })
    // .createTable('computers', function (table) {
    //   table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    //   table.string('hostname').notNullable();
    //   table.string('ip_address');
    //   table.string('os_name');
    //   table.string('os_version');
    //   table.string('status').defaultTo('active');
    //   table.timestamp('last_seen');
    // })
    // .createTable('applications', function (table) {
    //   table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    //   table.string('name').notNullable();
    //   table.string('vendor');
    //   table.string('version');
    //   table.text('description');
    //   table.string('status').defaultTo('active');
    //   table.timestamp('created_at').defaultTo(knex.fn.now());
    // })
    // .createTable('licenses', function (table) {
    //   table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    //   table.uuid('application_id').references('id').inTable('applications');
    //   table.string('license_key').notNullable();
    //   table.integer('seats');
    //   table.integer('seats_used').defaultTo(0);
    //   table.date('start_date');
    //   table.date('expiry_date');
    //   table.string('status').defaultTo('active');
    // })
    // .createTable('installations', function (table) {
    //   table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    //   table.uuid('computer_id').references('id').inTable('computers');
    //   table.uuid('application_id').references('id').inTable('applications');
    //   table.uuid('license_id').references('id').inTable('licenses');
    //   table.string('version');
    //   table.timestamp('install_date');
    //   table.string('status').defaultTo('active');
    //   table.string('installed_by');
    // });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

  return knex.schema
    .dropTable('installations')
    .dropTable('licenses')
    .dropTable('applications')
    .dropTable('computers')
    .dropTable('admin');

};
