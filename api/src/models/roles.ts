const pool = require('../db');

export const getRoles = async() => {
    try{
        const query = `SELECT * FROM roles`
        const response = await pool.query(query);
        return response.rows;
    }
    catch(e){
        console.error('Error retrieving roles: ' + e);
    }
}