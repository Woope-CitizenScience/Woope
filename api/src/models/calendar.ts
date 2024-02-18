
const pool = require('../db');
import { Event } from "../interfaces/Event";

export const createEvent = async (userId: number, title: string, description: string, location: string, startTime: Date, endTime: Date): Promise<void> => {
    const query =
        `
        INSERT INTO events (user_id, title, description, location, start_time, end_time)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
    const values = [userId, title, description, location, startTime, endTime];

    try {
        const result = await pool.query(query, values)
        return result.rows[0];
    } catch (error) {
        throw new Error("Error in creating event: " + (error as Error).message)
    }
};