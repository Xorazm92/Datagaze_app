import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    // Database
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_NAME: process.env.DB_NAME || 'base_app',

    // JWT
    JWT_PRIVAT_KEY: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',

    // Server
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
};