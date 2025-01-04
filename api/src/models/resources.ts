import { Resource } from "../interfaces/Resource";
const pool = require('../db');
//create a resource
export const createResource = async(name: string, tagline: string, text_description: string) => {
    if(!name){
        throw new Error("A valid name is required");
    }
    try{
        let query;
        let values;
        if(tagline && text_description){
            query = `
                INSERT INTO public.resource (name, tagline, text_description) VALUES ($1,$2,$3) RETURNING *
            `; 
            values = [name, tagline, text_description];
        }
        else if(tagline && !text_description){
            query = `
                INSERT INTO public.resource (name, tagline) VALUES ($1, $2) RETURNING *
            `;
            values = [name, tagline];
        }
        else if(text_description && !tagline){
            query = `
                INSERT INTO public.resource (name, text_description) VALUES ($1,$2) RETURNING *
            `;
            values = [name, text_description];
        }
        else{
            query = `
                INSERT INTO public.resource (name) VALUES ($1) RETURNING *
            `;
            values = [name];
        }
        const response = await pool.query(query, values);
        return response.rows;
    }
    catch(error){
        throw new Error("Error creating resource: " + (error as Error).message);
    }
}
//get all resources
export const getResources = async () : Promise<Resource[]>=> {
    try {
       let query = "SELECT * FROM public.resource ORDER BY resource_id ASC";
        const  response  = await pool.query(query);
        return response.rows;
    } catch (error) {
        throw new Error("Error retrieving resources: " + (error as Error).message);
    }
}