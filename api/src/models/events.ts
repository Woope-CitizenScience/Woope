import { Event } from "../interfaces/Event";
const pool = require('../db');

/**
 * Retrieves all events for a given organization.
 *
 * @param org_id - The ID of the organization.
 * @returns A promise that resolves to an array of events.
 */

export const getEvents = async (org_id: number): Promise<Event[]> => {
    try {
        let query = `SELECT * FROM public.event 
                    WHERE org_id = $1 
                    `;
        let values = [org_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error("Error retrieving events: " + (error as Error).message);
    }
}

/**
 * Creates a new event for an organization.
 *
 * @param org_id - The ID of the organization.
 * @param name - The name of the event.
 * @param tagline - The tagline for the event (optional).
 * @param text_description - The description of the event (optional).
 * @param time_begin - The start time of the event.
 * @param time_end - The end time of the event.
 * @returns A promise that resolves to the newly created event.
 */

export const createEvents = async (org_id: number, name: string, tagline: string, text_description: string, time_begin: Date, time_end: Date) => {
    try {
        let query;
        let values;
        if (tagline && text_description) {
            query = `
                INSERT INTO public.event (org_id, name, tagline, text_description, time_begin, time_end) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
            `;
            values = [org_id, name, tagline, text_description, time_begin, time_end];
        }
        else if (tagline && !text_description) {
            query = `
                INSERT INTO public.event (org_id, name, tagline, time_begin, time_end) VALUES ($1, $2, $3, $4, $5) RETURNING *
            `;
            values = [org_id, name, tagline, time_begin, time_end];
        }
        else if (text_description && !tagline) {
            query = `
                INSERT INTO public.event (org_id, name, text_description, time_begin, time_end) VALUES ($1,$2,$3,$4,$5) RETURNING *
            `;
            values = [org_id, name, text_description, time_begin, time_end];
        }
        else {
            query = `
                INSERT INTO public.event (org_id, name, time_begin, time_end) VALUES ($1, $2, $3, $4) RETURNING *
            `;
            values = [org_id, name, time_begin, time_end];
        }
        const response = await pool.query(query, values);
        return response.rows;
    }
    catch (error) {
        throw new Error("Error creating events: " + (error as Error).message);
    }
}

/**
 * Retrieves event details for a given event ID.
 *
 * @param event_id - The ID of the event.
 * @returns A promise that resolves to the event details.
 */

export const getEventInfo = async (event_id: number): Promise<Event[]> => {
    try {
        let query = `
            SELECT * 
            FROM public.event e
            WHERE e.event_id = $1`;
        const response = await pool.query(query, [event_id]);
        return response.rows;
    } catch (error) {
        throw new Error("Error retrieving events: " + (error as Error).message);
    }
}

/**
 * Deletes an event by its event ID and name.
 *
 * @param event_id - The ID of the event to delete.
 * @param name - The name of the event.
 * @returns A promise that resolves when the deletion is complete.
 */

export const deleteEvent = async (event_id: number, name: string) => {
    try {
        let query = `
            DELETE FROM public.event WHERE event_id = $1 AND name = $2
        `;
        let values = [event_id, name];
        await pool.query(query, values);
    } catch (error) {
        throw new Error("Error deleting event: " + (error as Error).message);
    }
}

/**
 * Updates an event's details by its event ID.
 *
 * @param event_id - The ID of the event to update.
 * @param tagline - The updated tagline of the event.
 * @param text_description - The updated description of the event.
 * @param time_begin - The updated start time of the event.
 * @param time_end - The updated end time of the event.
 * @returns A promise that resolves to the updated event.
 */

export const updateEvent = async (event_id: number, tagline: string, text_description: string, time_begin: Date, time_end: Date) => {
    try {
        let query;
        let values;

        query = `
            UPDATE public.event SET tagline = $1, text_description = $2, time_begin = $3, time_end = $4 WHERE event_id = $5 RETURNING *
        `;
        values = [tagline, text_description, time_begin, time_end, event_id];

        const response = await pool.query(query, values);
        return response.rows;
    }
    catch (error) {
        throw new Error("Error updating resource: " + (error as Error).message);
    }
}