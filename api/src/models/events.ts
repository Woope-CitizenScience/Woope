import { Event } from "../interfaces/Event";
const pool = require('../db');

//get all events 
export const getEvents = async (org_id: number) : Promise<Event[]> => {
    try {
       let query = `SELECT * FROM public.event 
                    WHERE org_id = $1 
                    `;
        let values = [org_id];
        const  result  = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error("Error retrieving events: " + (error as Error).message);
    }
}
//create an event
export const createEvents = async(org_id: number, name: string, tagline: string, text_description: string, time_begin: Date, time_end: Date) => {
    try{
        let query;
        let values;
        if(tagline && text_description){
            query = `
                INSERT INTO public.event (org_id, name, tagline, text_description, time_begin, time_end) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
            `; 
            values = [org_id, name, tagline, text_description, time_begin, time_end];
        }
        else if(tagline && !text_description){
            query = `
                INSERT INTO public.event (org_id, name, tagline, time_begin, time_end) VALUES ($1, $2, $3, $4, $5) RETURNING *
            `;
            values = [org_id, name, tagline, time_begin, time_end];
        }
        else if(text_description && !tagline){
            query = `
                INSERT INTO public.event (org_id, name, text_description, time_begin, time_end) VALUES ($1,$2,$3,$4,$5) RETURNING *
            `;
            values = [org_id, name, text_description, time_begin, time_end];
        }
        else{
            query = `
                INSERT INTO public.event (org_id, name, time_begin, time_end) VALUES ($1, $2, $3, $4) RETURNING *
            `;
            values = [org_id, name, time_begin, time_end];
        }
        const response = await pool.query(query, values);
        return response.rows;
    }
    catch(error){
        throw new Error("Error creating events: " + (error as Error).message);
    }
}
//gets event info when given its event id
export const getEventInfo = async (event_id: number) : Promise<Event[]> => {
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
//delete an event when given its event_id and name 
export const deleteEvent = async(event_id: number, name: string) => {
    try {
        let query = `
            DELETE FROM public.event WHERE event_id = $1 AND name = $2
        `;
        let values = [event_id, name];
        await pool.query(query,values);
    } catch (error) {
        throw new Error("Error deleting event: " + (error as Error).message);
    }
}
//update an event given its id
export const updateEvent = async(event_id: number, tagline: string, text_description: string, time_begin: Date, time_end: Date) => {
    try{
        let query;
        let values;
        
        query = `
            UPDATE public.event SET tagline = $1, text_description = $2, time_begin = $3, time_end = $4 WHERE event_id = $5 RETURNING *
        `; 
        values = [tagline, text_description, time_begin, time_end, event_id];
        
        const response = await pool.query(query, values);
        return response.rows;
    }
    catch(error){
        throw new Error("Error updating resource: " + (error as Error).message);
    }
}