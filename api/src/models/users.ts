import {User} from "../interfaces/User";

const pool = require('../db');

export const getUser = async (email?: string, phoneNumber?: string) => {
	if (!email && !phoneNumber) {
		throw new Error("Either an email or a phone number is required.");
	}

	try {
		let query;
		let values: string[] = [];

		if (email) {
			query = `
                SELECT u.*, p.first_name, p.last_name, p.date_of_birth
                FROM users u 
                LEFT JOIN profile_information p ON u.user_id = p.user_id
                WHERE u.email = $1`;
			values = [email];
		} else if (phoneNumber) {
			query = `
                SELECT u.*, p.first_name, p.last_name, p.date_of_birth
                FROM users u
                LEFT JOIN profile_information p ON u.user_id = p.user_id
                WHERE u.phone_number = $1`;
			values = [phoneNumber];
		}

		const result = await pool.query(query, values);
		if (result.rows.length === 0) {
			return null;
		}

		const userRow = result.rows[0];
		const user: User = {
			user_id: userRow.user_id,
			email: userRow.email,
			is_admin: userRow.is_admin,
			first_name: userRow.first_name,
			last_name: userRow.last_name,
			phone_number: userRow.phone_number,
			password_hash: userRow.password_hash,
			refresh_token: userRow.refresh_token,
		};
		return user;
	} catch (error) {
		throw new Error("Error retrieving user: " + (error as Error).message);
	}
};


export const getUserByRefreshToken = async (userId: string): Promise<User | null> => {
	try {
		const userQuery = `
            SELECT u.user_id, u.email, u.is_admin, u.phone_number, u.refresh_token,
                   p.first_name, p.last_name, p.date_of_birth
            FROM users u
            LEFT JOIN profile_information p ON u.user_id = p.user_id
            WHERE u.user_id = $1`;

		const userResult = await pool.query(userQuery, [userId]);
		if (userResult.rows.length === 0) {
			return null;
		}

		const userRow = userResult.rows[0];
		const user: User = {
			user_id: userRow.user_id,
			email: userRow.email,
			is_admin: userRow.is_admin,
			first_name: userRow.first_name,
			last_name: userRow.last_name,
			phone_number: userRow.phone_number,
			refresh_token: userRow.refresh_token,
		};
		return user;
	} catch (error) {
		throw new Error("Error retrieving user by refresh token: " + (error as Error).message);
	}
};


export const createUser = async (email: string, phoneNumber: string, hashedPassword: string, firstName: string, lastName: string, dateOfBirth: string) => {
	if (!email && !phoneNumber) {
		throw new Error("Either an email or a phone number is required.");
	}

	try {
		await pool.query('BEGIN');
		let query;
		let values;

		if (email && phoneNumber) {
			query = 'INSERT INTO users (email, phone_number, password_hash) VALUES ($1, $2, $3) RETURNING *';
			values = [email, phoneNumber, hashedPassword];
		} else if (email) {
			query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *';
			values = [email, hashedPassword];
		} else {
			query = 'INSERT INTO users (phone_number, password_hash) VALUES ($1, $2) RETURNING *';
			values = [phoneNumber, hashedPassword];
		}

		const userResult = await pool.query(query, values);
		const user = userResult.rows[0];

		query = 'INSERT INTO profile_information (user_id, first_name, last_name, date_of_birth) VALUES ($1, $2, $3, $4)';
		values = [user.user_id, firstName, lastName, dateOfBirth];
		await pool.query(query, values);

		// Additional inserts (like account_verifications) can be handled here

		await pool.query('COMMIT');

		return {
			user_id: user.user_id,
			email: user.email,
			phone_number: user.phone_number,
			is_admin: user.is_admin,
			first_name: firstName,
			last_name: lastName
		};

	} catch (error) {
		await pool.query('ROLLBACK');
		throw new Error("Error creating user: " + (error as Error).message);
	}
};

export const updateName = async (userId: string, firstName: string, lastName: string) => {
	try {
		await pool.query('BEGIN');

		const query = 'UPDATE profile_information SET first_name = $1, last_name = $2 WHERE user_id = $3';
		const values = [firstName, lastName, userId];

		await pool.query(query, values);

		await pool.query('COMMIT');

		return {
			user_id: userId,
			first_name: firstName,
			last_name: lastName,
		};

	} catch (error) {
		await pool.query('ROLLBACK');
		throw new Error("Error updating user name: " + (error as Error).message);
	}
};

export const getUserFullNameByID = async (userId: string) => {
	try {
		await pool.query('BEGIN');

		const query = 'SELECT first_name, last_name FROM profile_information WHERE user_id = $1';
		const values = [userId];

		const result = await pool.query(query, values);

		if (result.rows.length === 0) {
			return null;
		}
		const userINFO = result.rows[0];
		return userINFO;
		
	} catch (error) {
		throw new Error("Error getting user's name " + (error as Error).message);
	}
}

export const searchUsersWithName = async (name: string) => {
	try{
		await pool.query('BEGIN');

		const query = 'SELECT user_id, first_name, last_name FROM profile_information WHERE CONCAT(first_name, last_name) ILIKE $1';
		const values = [name + '%'];

		const result = await pool.query(query, values);

		if (result.rows.length === 0) {
			return null;
		}
		const userINFO = result.rows;
		return userINFO;
	} catch (error) {
		throw new Error("Error searching users: " + (error as Error).message);
	}
}


module.exports = { getUser, createUser, getUserByRefreshToken, updateName, getUserFullNameByID, searchUsersWithName };