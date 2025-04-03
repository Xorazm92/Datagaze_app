import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Software Inventory table
  await knex.schema.createTable('software_inventory', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('application_name').notNullable();
    table.string('version').notNullable();
    table.boolean('is_installed').defaultTo(false);
    table.string('path_to_file').nullable();
    table.string('path_to_icon').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('software_inventory');
}
