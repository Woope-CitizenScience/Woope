import { QueryResult } from "pg";
const pool = require('../db');

export const getUserByEmail = async (email: string) => {
    try {
        const query: string = 'SELECT * FROM users WHERE email = $1';
        const values: string[] = [email];
        const result: QueryResult = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error("Error retrieving user by email.");
    }
}

export const createUser = async (email: string, hashedPassword: string, firstName: string, lastName: string) => {
    try {
        const query: string = 'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)';
        const values: string[] = [email, hashedPassword, firstName, lastName];
        const result: QueryResult = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error("Error creating user.");
    }
}

module.exports = { getUserByEmail, createUser };
