const pool = require('../db');

/**
 * Retrieves all roles from the database.
 * 
 * @returns {Promise<any[]>} A promise that resolves to an array of roles.
 * @throws {Error} Throws an error if there is an issue retrieving roles from the database.
 */

export const getRoles = async () => {
    try {
        const query = `SELECT * FROM roles`
        const response = await pool.query(query);
        return response.rows;
    }
    catch (e) {
        console.error('Error retrieving roles: ' + e);
    }
}