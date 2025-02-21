exports.up = function (knex) {
  return knex.schema.createTable('admin', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('username').notNullable().unique();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.text('role').defaultTo('admin');
    table.string('status').defaultTo('active');
    table.timestamp('last_login');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('admin');
}; 