import { Knex } from 'knex';

const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'base_app',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './src/core/database/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './src/core/database/seeds',
  },
};

export default config;
