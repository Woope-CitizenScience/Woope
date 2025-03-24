import { error } from "console";
import { Resource, ResourceMedia } from "../interfaces/Resource";
import * as fs from 'node:fs'

const p = require('path')

const pool = require('../db');

//create a resource
export const createResource = async(org_id: number, name: string, tagline: string, text_description: string) => {
    if(!name){
        throw new Error("A valid name is required");
    }
    try{
        let query;
        let values;
        if(tagline && text_description){
            query = `
                INSERT INTO public.resource (org_id, name, tagline, text_description) VALUES ($1,$2,$3,$4) RETURNING *
            `; 
            values = [org_id, name, tagline, text_description];
        }
        else if(tagline && !text_description){
            query = `
                INSERT INTO public.resource (org_id, name, tagline) VALUES ($1, $2, $3) RETURNING *
            `;
            values = [org_id, name, tagline];
        }
        else if(text_description && !tagline){
            query = `
                INSERT INTO public.resource (org_id, name, text_description) VALUES ($1,$2,$3) RETURNING *
            `;
            values = [org_id, name, text_description];
        }
        else{
            query = `
                INSERT INTO public.resource (org_id, name) VALUES ($1,$2) RETURNING *
            `;
            values = [org_id, name];
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
//get all resources given an organization id
export const getResourceById = async (org_id: number) : Promise<Resource[]> => {
    try {
        let query = `
            SELECT * 
            FROM public.resource r
            WHERE r.org_id = $1`;
        const response = await pool.query(query, [org_id]);
        return response.rows;
    } catch (error) {
        throw new Error("Error retrieving resources: " + (error as Error).message);
    }
}
//gets resource info when given its resource id
export const getResourceInfo = async (resource_id: number) : Promise<Resource[]> => {
    try {
        let query = `
            SELECT * 
            FROM public.resource r
            WHERE r.resource_id = $1`;
        const response = await pool.query(query, [resource_id]);
        return response.rows;
    } catch (error) {
        throw new Error("Error retrieving resources: " + (error as Error).message);
    }
}
//update a resource given its id
export const updateResource = async(resource_id: number, tagline: string, text_description: string) => {
    try{
        let query;
        let values;
        if(tagline && text_description){
            query = `
                UPDATE public.resource SET tagline = $1, text_description = $2 WHERE resource_id = $3 RETURNING *
            `; 
            values = [tagline, text_description, resource_id];
        }
        else if(tagline && !text_description){
            query = `
                UPDATE public.resource SET tagline = $1 WHERE resource_id = $2 RETURNING *
            `;
            values = [tagline, resource_id];
        }
        else if(text_description && !tagline){
            query = `
                UPDATE public.resource SET text_description = $1 WHERE resource_id = $2 RETURNING *
            `;
            values = [text_description, resource_id];
        }
        else{
            throw new Error("No fields entered, no changes were made")
        }
        const response = await pool.query(query, values);
        return response.rows;
    }
    catch(error){
        throw new Error("Error updating resource: " + (error as Error).message);
    }
}
//delete a resource when given its resource_id and name 
export const deleteResource = async(resource_id: number, name: string) => {
    try {
        let query = `
            DELETE FROM public.resource WHERE resource_id = $1 AND name = $2
        `;
        let values = [resource_id, name];
        await pool.query(query,values);
    } catch (error) {
        throw new Error("Error deleting resource: " + (error as Error).message);
    }
}
//get all resource media corresponding to the resource Id
export const getResourceMedia = async (resource_id: number) : Promise<ResourceMedia[]> => {
    try {
        let query = `
            SELECT * 
            FROM public.resource_media r
            WHERE r.resource_id = $1`;
        const response = await pool.query(query, [resource_id]);
        return response.rows;
    } catch (error) {
        throw new Error("Error retrieving resources: " + (error as Error).message);
    }
}
export const insertResourceMedia = async(resource_id: number, name: string, file_path: string) => {
    try {
        let query = `
            INSERT INTO public.resource_media (resource_id, name, file_path) VALUES ($1,$2,$3) RETURNING *
        `;
        let values = [resource_id, name, file_path];
        const response = await pool.query(query, values);
        return response.rows;
    } catch (error) {
        throw new Error("Error adding file: " + (error as Error).message);
    }
}
export const deleteResourceMedia = async (media_id: number) => {
    try {
        let query = `
            DELETE FROM public.resource_media WHERE media_id = $1
        `
        let values = [media_id]
        await pool.query(query,values);
    } catch (error) {
        throw new Error("Error deleting file: " + (error as Error).message)
    }
}

export const serverDelete = async (path: string) => {
    try {
        fs.unlinkSync(p.join(__dirname, `./../../uploads/${path}`));
    } catch (error) {
        throw new Error("Error deleting file from server " + (error as Error).message)
    }
}

export const updatePhoto = async(resource_id: number, image_path: string) =>{
    try{
            let query = `
                UPDATE public.resource SET image_path = $1 WHERE resource_id = $2 RETURNING *
            `; 
            let values = [image_path, resource_id];
            const response = await pool.query(query,values);
            return response.rows;
    }
    catch(error){
        throw new Error("Error updating photo: " + (error as Error).message);
    }
}