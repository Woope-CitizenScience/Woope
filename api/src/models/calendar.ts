
const pool = require('../db');
import { Event } from "../interfaces/Event";

export const createEvent = async (event_id: number, user_id: number, title: string, description: string, location: string, startTime: Date, endTime: Date, isActive: boolean = true): Promise<void> => {
    const query =
        `
        INSERT INTO events (event_id, user_id, title, description, location, start_time, end_time, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `;
    const values = [event_id, user_id, title, description, location, startTime, endTime, isActive];

    try {
        const result = await pool.query(query, values)
        if (result.rowCount === 0) {
            throw new Error("Problem in creating event!");
        }
    } catch (error) {
        throw new Error("Error in creating event: " + (error as Error).message)
    }
};

export const getEvent = async (event_id: number,  user_id: number): Promise<void> => {
    const query = `SELECT * FROM event_id = $1 AND user_id = $2`;
    const values = [event_id, user_id];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
             throw new Error("Problem getting event");
        }
    } catch (error) {
        throw new Error("Error in deleting event: " + (error as Error).message);
    }
}



// TODO do we need to validate user_id to current user
export const deleteEvent = async (eventId: number, userId: number): Promise<void> => {
    const query = 'DELETE FROM events WHERE event_id =  $1 AND user_id = $2';
    const values = [eventId, userId];

    try{
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
             throw new Error("Problem in deleting event!");
        }

        }catch (error){
        throw new Error("Error in deleting event: " + (error as Error).message);
    }

}


















//-------------------------------------------------

