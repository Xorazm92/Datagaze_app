// migrations/20250318_create_agent_tables.js
exports.up = function (knex) {
  return knex.schema
    .createTable('agents', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('machine_id').unique().notNullable();
      table.string('hostname').notNullable();
      table.string('os').notNullable();
      table.string('os_version').notNullable();
      table.string('agent_version').notNullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamp('last_connected');
      table.timestamps(true, true);
    })
    .createTable('installed_apps', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table
        .uuid('agent_id')
        .references('id')
        .inTable('agents')
        .onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('version').notNullable();
      table.integer('size').notNullable();
      table.string('app_id').unique().notNullable();
      table.boolean('is_installed').defaultTo(true);
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('installed_apps')
    .dropTableIfExists('agents');
};
