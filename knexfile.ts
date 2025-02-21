import { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      database: "base_app",
      user: "postgres",
      password: "postgres"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations/"
    }
  }
};

export default config;
