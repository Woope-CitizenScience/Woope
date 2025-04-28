import { config } from '../config/config';
import { Pool } from "pg";

const pool = new Pool({
    user: config.postgresUser,
    password: config.postgresPassword,
    host: config.postgresHost,
    database: config.postgresDB,
    port: config.postgresPort,
});

module.exports = pool;
