import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      database: "datagaze",
      user: "postgres",
      password: "postgres"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/core/database/migrations"
    },
    seeds: {
      directory: "./src/core/database/seeds"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "datagaze",
      user: "postgres",
      password: "postgres"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/core/database/migrations"
    },
    seeds: {
      directory: "./src/core/database/seeds"
    }
  }
};

export default config;
