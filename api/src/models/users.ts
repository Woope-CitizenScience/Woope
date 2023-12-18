const pool = require('../db');

export const getUser = async (email?: string, phoneNumber?: string) => {
    if (!email && !phoneNumber) {
        throw new Error("Either an email or a phone number is required.");
    }

    try {
        let query;
        let values: string[] = [];

        if (email) {
            query = 'SELECT * FROM users WHERE email = $1';
            values = [email];
        } else if (phoneNumber) {
            query = 'SELECT * FROM users WHERE phone_number = $1';
            values = [phoneNumber];
        }

	    const result = await pool.query(query, values);
	    if (result.rows.length === 0) {
		    return null;
	    }

        return result.rows[0];
    } catch (error) {
        throw new Error("Error retrieving user: " + (error as Error).message);
    }
};



export const createUser = async (email: string, phoneNumber: string, hashedPassword: string, firstName: string, lastName: string) => {
	if (!email && !phoneNumber) {
		throw new Error("Either an email or a phone number is required.");
	}

	try {
		await pool.query('BEGIN');
		let query;
		let values;

		if (email && phoneNumber) {
			query = 'INSERT INTO users (email, phone_number, password_hash) VALUES ($1, $2, $3) RETURNING user_id';
			values = [email, phoneNumber, hashedPassword];
		} else if (email) {
			query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id';
			values = [email, hashedPassword];
		} else {
			query = 'INSERT INTO users (phone_number, password_hash) VALUES ($1, $2) RETURNING user_id';
			values = [phoneNumber, hashedPassword];
		}

		const result = await pool.query(query, values);
		const userId = result.rows[0].user_id;

		query = 'INSERT INTO profile_information (user_id, first_name, last_name) VALUES ($1, $2, $3)';
		values = [userId, firstName, lastName];
		await pool.query(query, values);

		// Additional inserts (like account_verifications) can be handled here

		await pool.query('COMMIT');
		return userId;

	} catch (error) {
		await pool.query('ROLLBACK');
		throw new Error("Error creating user: " + (error as Error).message);
	}
};




module.exports = { getUser, createUser };
