const pool = require('../db');

export const logActivity = async(userId: number, description: string) => {
    try {
        let query = `INSERT INTO activity (user_id, description) VALUES ($1, $2) RETURNING *`
        let values = [userId, description]

        const result = await pool.query(query, values)

        return result.rows;

    } catch (error) {
        throw new Error("Error retrieving events: " + (error as Error).message);
    }
}