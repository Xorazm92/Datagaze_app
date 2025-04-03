
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('dlp_policies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('description');
    table.jsonb('rules').notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('dlp_reports', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('policy_id').references('id').inTable('dlp_policies');
    table.string('event_type');
    table.jsonb('event_data');
    table.timestamp('event_time').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('dlp_reports');
  await knex.schema.dropTable('dlp_policies');
}
