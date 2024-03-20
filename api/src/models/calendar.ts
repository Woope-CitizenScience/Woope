import {start} from "node:repl";

const pool = require('../db');
import { Event } from "../interfaces/Event";

export const createEvent = async (user_id: number, title: string, description: string, location: string, startTime: Date, endTime: Date, isActive: boolean = true): Promise<void> => {
    const query =
        `
        INSERT INTO events (user_id, title, description, location, start_time, end_time, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;
    const values = [user_id, title, description, location, startTime, endTime, isActive];

    try {
        const result = await pool.query(query, values)
        if (result.rowCount === 0) {
            throw new Error("Problem in creating event!");
        }
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

export const modifyEvent = async (event_id: number, user_id: number, title: string, description: string, location: string, start_time: Date, end_time: Date): Promise<void> => {
    const query =
        `
            UPDATE events
            SET title=$1,
                description=$2,
                location=$3,
                start_time=$4,
                end_time=$5
            WHERE event_id = $6
              AND user_id = $7;
        `;
    const values = [title, description, location, start_time, end_time, event_id, user_id];


    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error("Problem in modifying event!");
        }
    } catch(error) {
            throw new Error((error as Error).message);
        }
}


export const getEvent = async (event_id: number): Promise<Event> => {
    const query = `SELECT * FROM events WHERE event_id = $1`;
    const values = [event_id];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error("Event not found");
        }
        return result.rows[0];
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export const getEventOnDate = async (selectedDate: string): Promise<Event[]> => {
    //selectedDate must be of format: YYYY-MM-DD for query to properly execute
    const query =
        `
            SELECT * FROM events
            WHERE $1::date BETWEEN start_time::date AND end_time::date;
        `
    const value = [selectedDate]
    try {
        const result = await pool.query(query, value);
        if (result.rowCount === 0) {
            throw new Error(`Problem in getting event(s) on ${selectedDate}`);
        }
        return result.rows;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}


// TODO do we need to validate user_id to current user
export const deleteEvent = async (eventId: number, userId: number): Promise<boolean> => {
    const query = 'DELETE FROM events WHERE event_id = $1 AND user_id = $2';
    const values = [eventId, userId];

    try {
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const getAllEvents = async (): Promise<Event[]> => {
    const query = `SELECT * FROM events`;

    try {
        const result = await pool.query(query);
        if (result.rowCount === 0)
            return [];
        return result.rows;

        } catch (error) {
            throw new Error( (error as Error).message );
        }
    };
//-------------------------------------------------

