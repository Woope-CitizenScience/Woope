import { Report } from "../interfaces/Report";
const pool = require('../db');

/**
 * Creates a new report.
 * @param {string} label - The label of the report (e.g., "Bug", "Feature Request").
 * @param {string} title - The title of the report.
 * @param {string} description - A detailed description of the report.
 * @returns {Promise<Report>} The created report object.
 * @throws Will throw an error if the report creation fails.
 */

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