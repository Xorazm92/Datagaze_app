import type { Knex } from "knex";

/**
 * Create the 'products' table based on the IProduct interface.
 * The table includes fields for product details, versioning, paths, scripts, and timestamps.
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.uuid('server_id').nullable(); // Can be null initially
    table.text('description').nullable();
    table.jsonb('min_requirements').nullable();
    table.string('publisher').nullable();
    table.string('server_version').nullable();
    table.string('agent_version').nullable();
    table.string('server_path').nullable();
    table.string('agent_path').nullable();
    table.string('icon_path').nullable();
    table.text('install_scripts').nullable();
    table.text('update_scripts').nullable();
    table.text('delete_scripts').nullable();
    table.boolean('is_installed').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

/**
 * Drop the 'products' table.
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products');
}
