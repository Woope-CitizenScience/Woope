import {Report} from "../interfaces/Report"; 
const pool = require('../db');

export const createReport = async (
    label: string,
    title: string,
    description: string
): Promise<Report> => {
    try {
        const response = await pool.query(
            'INSERT INTO public.reports (label, title, description) VALUES ($1, $2, $3) RETURNING *', [label, title, description]
        );
        console.log('Created Report:', response.rows[0]); // debug for creating report
        return response.rows[0]
    } catch (error) {
        console.error('Error creating report', error);
        throw error
    }
    
};