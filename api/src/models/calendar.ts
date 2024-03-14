import {start} from "node:repl";

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
            throw new Error("Error in moifying event: " + (error as Error).message);
        }
}

export const getEvent = async (event_id: number,  user_id: number): Promise<void> => {
    const query = `SELECT * FROM event_id = $1 AND user_id = $2`;
    const values = [event_id, user_id];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
             throw new Error("Problem in getting event");
        }
    } catch (error) {
        throw new Error("Error in deleting event: " + (error as Error).message);
    }
}


export const getEventOnDate = async (selectedDate: string): Promise<void> => {
    //selectedDate must be of format: YYYY-MM-DD for query to properly execute
    const query =
        `
            SELECT * FROM events
            WHERE DATE $1 BETWEEN start_time::Date AND end_time::Date;
        `
    const value = [selectedDate]
    try {
        const result = await pool.query(query, value);
        if (result.rowCount === 0) {
            throw new Error(`Problem in getting event(s) on ${selectedDate}`);
        }
    } catch (error) {
        throw new Error(`Error in getting events on ${selectedDate}: ` + (error as Error).message);
    }
}


// TODO do we need to validate user_id to current user
export const deleteEvent = async (eventId: number, userId: number): Promise<void> => {
    // TODO instead of deleting event, we can set_Active as false so that the event does not render
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

