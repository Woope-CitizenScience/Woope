import {User} from "../interfaces/User";

const pool = require('../db');

/**
 * Retrieves a user by email or phone number from the database.
 *
 * This function queries the database to fetch a user record that matches the provided email or
 * phone number. If neither email nor phone number is provided, it throws an error.
 * The function joins the `users` table with the `profile_information` table to retrieve
 * additional user details, such as first name, last name, and date of birth.
 *
 * @param email - The user's email address. Optional if `phoneNumber` is provided.
 * @param phoneNumber - The user's phone number. Optional if `email` is provided.
 * @returns A promise that resolves to a `User` object if found, or `null` if no user matches the criteria.
 * @throws An error if neither email nor phone number is provided, or if there is an error during the database query.
 */
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
			user_role: userRow.user_role
		};
		return user;
	} catch (error) {
		throw new Error("Error retrieving user: " + (error as Error).message);
	}
};

/**
 * Retrieves a user by their user ID, including their refresh token and profile information.
 *
 * This function queries the database to fetch a user record based on the specified user ID.
 * It joins the `users` table with the `profile_information` table to retrieve additional details,
 * such as first name, last name, and date of birth. The refresh token is also included in the result.
 *
 * @param userId - The unique identifier of the user.
 * @returns A promise that resolves to a `User` object if the user is found, or `null` if no user matches the user ID.
 * @throws An error if there is an issue during the database query.
 */
export const getUserByRefreshToken = async (userId: string): Promise<User | null> => {
	try {
		const userQuery = `
            SELECT u.*, p.first_name, p.last_name, p.date_of_birth
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
			user_role: userRow.user_role
		};
		return user;
	} catch (error) {
		throw new Error("Error retrieving user by refresh token: " + (error as Error).message);
	}
};

/**
 * Creates a new user in the database with profile information.
 *
 * This function inserts a new user record into the `users` table and, if successful,
 * adds associated profile information in the `profile_information` table.
 * Either an email or a phone number is required for user creation.
 *
 * @param email - The user's email address.
 * @param phoneNumber - The user's phone number.
 * @param hashedPassword - The user's hashed password.
 * @param firstName - The user's first name.
 * @param lastName - The user's last name.
 * @param dateOfBirth - The user's date of birth.
 * @returns A promise that resolves to an object containing the user's ID, email, phone number, admin status, first name, and last name.
 * @throws An error if neither email nor phone number is provided, or if there is an error during the database query.
 */
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
			last_name: lastName,
			user_role: user.user_role
		};

	} catch (error) {
		await pool.query('ROLLBACK');
		throw new Error("Error creating user: " + (error as Error).message);
	}
};

/**
 * Updates a user's first and last name in the database.
 *
 * @param userId - The unique identifier of the user.
 * @param firstName - The new first name to set for the user.
 * @param lastName - The new last name to set for the user.
 * @returns A promise that resolves to an object containing the user's ID, updated first name, and last name.
 * @throws An error if there is an issue during the database query.
 */
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

/**
 * Retrieves a user's full name by their user ID.
 *
 * This function queries the `profile_information` table to fetch the first and last name
 * of the user associated with the given user ID.
 *
 * @param userId - The unique identifier of the user.
 * @returns A promise that resolves to an object containing `first_name` and `last_name` if found, or `null` if no user is found.
 * @throws An error if there is an issue during the database query.
 */
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

/**
 * Searches for users whose names match a given query.
 *
 * This function performs a case-insensitive search in the `profile_information` table
 * for users whose concatenated first and last names start with the provided name string.
 *
 * @param name - The name or partial name to search for.
 * @returns A promise that resolves to an array of matching user objects, each containing `user_id`, `first_name`, and `last_name`.
 *          If no matches are found, resolves to `null`.
 * @throws An error if there is an issue during the database query.
 */
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
