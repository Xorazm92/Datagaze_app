import { ENV } from './env';

export const databaseConfig = {
    client: 'pg',
    connection: {
        host: ENV.DB_HOST,
        port: ENV.DB_PORT,
        user: ENV.DB_USER,
        password: ENV.DB_PASSWORD,
        database: ENV.DB_NAME,
    },
    pool: {
        min: 2,
        max: 10,
    },
};

// For direct database access in services
import knex from 'knex';
const db = knex(databaseConfig);
export default db;
