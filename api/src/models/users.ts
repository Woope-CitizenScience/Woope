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

export const createUser = async (email:string, phoneNumber:number, hashedPassword:string, firstName:string, lastName:string) => {
    if (!email && !phoneNumber) {
        throw new Error("Either an email or a phone number is required.");
    }

    try {
        await pool.query('BEGIN');
        let query;
        let values;

        if (email) {
            query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id';
            values = [email, hashedPassword];
        } else {
            query = 'INSERT INTO users (phone_number, password_hash) VALUES ($1, $2) RETURNING user_id';
            values = [phoneNumber, hashedPassword];
        }

        let result = await pool.query(query, values);

        const userId = result.rows[0].user_id;

        // profile info
        query = 'INSERT INTO profile_information (user_id, first_name, last_name) VALUES ($1, $2, $3)';
        values = [userId, firstName, lastName];
        await pool.query(query, values);

        // Optionally, handle other inserts like account_verifications here

        // Commit the transaction
        await pool.query('COMMIT');

        // Return the newly created user's ID
        return userId;

    } catch (error) {
        // If an error occurs, rollback the transaction
        await pool.query('ROLLBACK');
        // @ts-ignore
        throw new Error("Error creating user: " + error.message);
    }
}



module.exports = { getUserByEmail, createUser };
