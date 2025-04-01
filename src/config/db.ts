import dotenv from 'dotenv';
import path from 'path';
import { createPool } from 'mysql2';

dotenv.config({path: path.resolve(__dirname, '../../.env')});

export const conn = createPool({
    host: process.env.DB_HOST as string,
    port: process.env.DB_PORT as any,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
});