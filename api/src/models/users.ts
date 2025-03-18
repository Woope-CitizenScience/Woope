import { User } from "../interfaces/User";

const pool = require('../db');

/**
 * Retrieves a user by their email or phone number.
 * 
 * @param {string} [email] - The email of the user to retrieve.
 * @param {string} [phoneNumber] - The phone number of the user to retrieve.
 * @returns {Promise<User | null>} - The user object if found, otherwise null.
 * @throws {Error} - If neither email nor phone number is provided, or if an error occurs during retrieval.
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
                SELECT u.*, o.name AS org_name, p.first_name, p.last_name, p.date_of_birth
                FROM users u 
                LEFT JOIN profile_information p ON u.user_id = p.user_id
				LEFT JOIN organizations AS o ON u.admins_org = o.org_id
                WHERE u.email = $1`;
			values = [email];
		} else if (phoneNumber) {
			query = `
                SELECT u.*, o.name AS org_name, p.first_name, p.last_name, p.date_of_birth
                FROM users u 
                LEFT JOIN profile_information p ON u.user_id = p.user_id
				LEFT JOIN organizations AS o ON u.admins_org = o.org_id
                WHERE u.phone_number = $1`;
			values = [phoneNumber];
		}

		const result = await pool.query(query, values);
		if (result.rows.length === 0) {
			return null;
		}

		const userRow = result.rows[0];
		const userPermissions = await getUserPermissions(userRow.user_id);
		const user: User = {
			user_id: userRow.user_id,
			email: userRow.email,
			role_id: userRow.role_id,
			first_name: userRow.first_name,
			last_name: userRow.last_name,
			phone_number: userRow.phone_number,
			password_hash: userRow.password_hash,
			refresh_token: userRow.refresh_token,
			permissions: userPermissions,
			org_id: userRow.admins_org,
			org_name: userRow.org_name
		};
		console.log(user);
		return user;
	} catch (error) {
		throw new Error("Error retrieving user: " + (error as Error).message);
	}
};

/**
 * Retrieves a user by their refresh token.
 * 
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<User | null>} - The user object if found, otherwise null.
 * @throws {Error} - If an error occurs during retrieval.
 */

export const getUserByRefreshToken = async (userId: string): Promise<User | null> => {
	try {
		const userQuery = `
            SELECT u.user_id, u.email, u.role_id, u.phone_number, u.refresh_token,
                   u.admins_org, o.name as org_name, p.first_name, 
				   p.last_name, p.date_of_birth
            FROM users u
            LEFT JOIN profile_information p ON u.user_id = p.user_id
			LEFT JOIN organizations o ON u.admins_org=o.org_id
            WHERE u.user_id = $1`;

		const userResult = await pool.query(userQuery, [userId]);
		if (userResult.rows.length === 0) {
			return null;
		}

		const userRow = userResult.rows[0];
		const userPermissions = await getUserPermissions(userRow.user_id)
		const user: User = {
			user_id: userRow.user_id,
			email: userRow.email,
			role_id: userRow.role_id,
			first_name: userRow.first_name,
			last_name: userRow.last_name,
			phone_number: userRow.phone_number,
			refresh_token: userRow.refresh_token,
			org_id: userRow.admins_org,
			org_name: userRow.org_name,
			permissions: userPermissions
		};
		return user;
	} catch (error) {
		throw new Error("Error retrieving user by refresh token: " + (error as Error).message);
	}
};

/**
 * Creates a new user with the provided details.
 * 
 * @param {string} email - The email of the new user.
 * @param {string} phoneNumber - The phone number of the new user.
 * @param {string} hashedPassword - The hashed password for the new user.
 * @param {string} firstName - The first name of the new user.
 * @param {string} lastName - The last name of the new user.
 * @param {string} dateOfBirth - The date of birth of the new user.
 * @returns {Promise<Object>} - The created user object.
 * @throws {Error} - If neither email nor phone number is provided, or if an error occurs during creation.
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
		const userPermissions = await getUserPermissions(user.user_id);

		query = 'INSERT INTO profile_information (user_id, first_name, last_name, date_of_birth) VALUES ($1, $2, $3, $4)';
		values = [user.user_id, firstName, lastName, dateOfBirth];
		await pool.query(query, values);

		// Additional inserts (like account_verifications) can be handled here

		await pool.query('COMMIT');

		return {
			user_id: user.user_id,
			email: user.email,
			phone_number: user.phone_number,
			first_name: firstName,
			last_name: lastName,
			role_id: user.role_id,
			permissions: userPermissions,
			org_id: user.org_id,
			org_name: user.org_name
		}
	} catch (error) {
		await pool.query('ROLLBACK');
		throw new Error("Error creating user: " + (error as Error).message);
	}
};

/**
 * Updates the first and last name of a user.
 * 
 * @param {string} userId - The ID of the user to update.
 * @param {string} firstName - The new first name.
 * @param {string} lastName - The new last name.
 * @returns {Promise<Object>} - The updated user object.
 * @throws {Error} - If an error occurs during the update.
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
 * Retrieves the full name of a user by their ID.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object | null>} - The user's first and last name if found, otherwise null.
 * @throws {Error} - If an error occurs during retrieval.
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
 * Retrieves detailed information about a user by their ID.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Object> | null>} - The user's information if found, otherwise null.
 * @throws {Error} - If an error occurs during retrieval.
 */

export const getUserByID = async (userId: string) => {
	try {
		await pool.query('BEGIN');

		const query = `
			select u.email, u.phone_number, u.created_at, u.admins_org, r.name, p.first_name, p.last_name, p.date_of_birth 
				from users as u
				join profile_information as p
				on u.user_id=p.user_id
				join roles as r
				on r.role_id=u.role_id
				and u.user_id=$1
		`;

		const values = [userId];

		const result = await pool.query(query, values);

		if (result.rows.length === 0) {
			return null;
		}
		const userINFO = result.rows;
		return userINFO;
	} catch (error) {
		throw new Error("Error getting user's info " + (error as Error).message);
	}
}

/**
 * Searches for users by their full name.
 * 
 * @param {string} name - The name to search for.
 * @returns {Promise<Array<Object> | null>} - The list of users matching the search criteria if found, otherwise null.
 * @throws {Error} - If an error occurs during the search.
 */

export const searchUsersWithName = async (name: string) => {
	try {
		await pool.query('BEGIN');

		const query = `
		SELECT u.user_id, p.first_name, p.last_name, u.email, r.name AS role, o.name AS org 
		FROM users AS u
		JOIN profile_information AS p
		ON u.user_id = p.user_id
		LEFT JOIN roles AS r
		ON r.role_id = u.role_id
		LEFT JOIN organizations AS o
		ON u.admins_org = o.org_id
		WHERE LOWER(CONCAT(p.first_name, p.last_name)) 
		LIKE LOWER(REPLACE($1, ' ', ''))
	  `;
		const values = [`%${name}%`];

		const result = await pool.query(query, values);

		if (result.rows.length === 0) {
			return null;
		}

		return result.rows;
	} catch (error) {
		throw new Error("Error searching users: " + (error as Error).message);
	}
};

/**
 * Retrieves the permissions of a user by their ID.
 * 
 * @param {number} userId - The ID of the user.
 * @returns {Promise<string>} - The user's permissions in JSON format.
 * @throws {Error} - If an error occurs during retrieval.
 */

export const getUserPermissions = async (userId: number) => {
	try {
		const query = `
		SELECT 
			json_object_agg(
				p.name, t.permission_id IS NOT NULL
			) AS permissions_json
		FROM 
			permissions p
		LEFT JOIN (
			SELECT rp.permission_id
			FROM users u
		JOIN role_permissions rp
			ON rp.role_id = u.role_id
			WHERE u.user_id = $1
		) t ON p.permission_id = t.permission_id;`
		const values = [userId]

		const result = await pool.query(query, values);
		const permissionsJson = JSON.stringify(result.rows[0].permissions_json);

		return permissionsJson;

	} catch (error) {
		throw new Error("Error retrieving user permissions: " + (error as Error).message);
	}
}

/**
 * Updates the organization of a user.
 * 
 * @param {string} userId - The ID of the user to update.
 * @param {string | null} orgId - The new organization ID, or null to remove the organization.
 * @returns {Promise<Object>} - The updated user object.
 * @throws {Error} - If an error occurs during the update.
 */

export const updateUserOrg = async (userId: string, orgId: string | null) => {
	try {
		const response = await pool.query(
			`UPDATE users SET admins_org=$1 WHERE user_id=$2 RETURNING *`,
			[orgId, userId]
		)
		console.log(response.rows[0])
		return response.rows[0];
	}
	catch (error) {
		console.error(`Error updating user with user id ${userId}`, error);
		throw error;
	}
}

/**
 * Updates the role of a user.
 * 
 * @param {string} userId - The ID of the user to update.
 * @param {string} roleId - The new role ID.
 * @returns {Promise<Object>} - The updated user object.
 * @throws {Error} - If an error occurs during the update.
 */

export const updateUserRole = async (userId: string, roleId: string) => {
	try {
		const response = await pool.query(
			`UPDATE users SET role_id=$1 WHERE user_id=$2 RETURNING *`,
			[roleId, userId]
		)
		console.log(response.rows[0])
		return response.rows[0];
	}
	catch (error) {
		console.error(`Error updating user with user id ${userId}`, error);
		throw error;
	}
}

module.exports = { getUser, createUser, getUserByRefreshToken, updateName, getUserFullNameByID, getUserByID, searchUsersWithName, updateUserOrg, updateUserRole };
