const pool = require('../db');

/**
 * Creates a follow relationship between two users.
 *
 * @param {string} follower_id - The ID of the user who is following.
 * @param {string} following_id - The ID of the user being followed.
 * @returns {Promise<{ follower_id: string, following_id: string }>} An object containing the follower and following IDs.
 * @throws {Error} Throws an error if the follow relationship cannot be created.
 */

export const createFollowRelation = async (follower_id: string, following_id: string) => {
	try {
		await pool.query('BEGIN');



		const query = 'INSERT INTO user_follows (follower_id, following_id) VALUES ($1, $2)';
		const values = [follower_id, following_id];

		await pool.query(query, values);

		await pool.query('COMMIT');

		return {
			follower_id: follower_id,
			following_id: following_id,
		};

	} catch (error) {
		await pool.query('ROLLBACK');
		throw new Error("Error generating follow: " + (error as Error).message);
	}
};

/**
 * Deletes a follow relationship between two users.
 *
 * @param {string} follower_id - The ID of the user who is unfollowing.
 * @param {string} following_id - The ID of the user being unfollowed.
 * @returns {Promise<{ follower_id: string, following_id: string }>} An object containing the follower and following IDs.
 * @throws {Error} Throws an error if the follow relationship cannot be removed.
 */

export const deleteFollowRelation = async (follower_id: string, following_id: string) => {
	try {
		await pool.query('BEGIN');

		const query = 'DELETE FROM user_follows WHERE follower_id = $1 AND following_id = $2;';
		const values = [follower_id, following_id];

		await pool.query(query, values);

		await pool.query('COMMIT');

		return {
			follower_id: follower_id,
			following_id: following_id,
		};

	} catch (error) {
		await pool.query('ROLLBACK');
		throw new Error("Error removing follow: " + (error as Error).message);
	}
};

/**
 * Retrieves a list of users that the given user is following.
 *
 * @param {string} user_id - The ID of the user whose following list is being retrieved.
 * @returns {Promise<{ user_id: string, first_name: string, last_name: string }[] | null>} A list of users being followed or null if none are found.
 * @throws {Error} Throws an error if the following list cannot be retrieved.
 */

export const getFollowingList = async (user_id: string) => {
	try {
		await pool.query('BEGIN');

		{/* Returns user_id first and last name of all people that the user follows */ }
		const query = 'SELECT pi.user_id, pi.first_name, pi.last_name FROM user_follows uf INNER JOIN profile_information pi ON uf.following_id = pi.user_id WHERE uf.follower_id = $1;';
		const values = [user_id];

		const result = await pool.query(query, values);

		if (result.rows.length === 0) {
			return null;
		}
		return result.rows;

	} catch (error) {
		throw new Error("Internal Server Error: " + (error as Error).message);
	}
};

/**
 * Retrieves the count of followers a user has.
 *
 * @param {string} user_id - The ID of the user whose follower count is being retrieved.
 * @returns {Promise<{ follower_of_count: number }>} An object containing the count of followers.
 * @throws {Error} Throws an error if the follower count cannot be retrieved.
 */

export const getFollowerCount = async (user_id: string) => {
	try {
		await pool.query('BEGIN');

		{/* Returns count of all people that follow the user */ }
		const query = 'SELECT COUNT(following_id) AS follower_of_count FROM user_follows WHERE following_id = $1;';
		const values = [user_id];

		const result = await pool.query(query, values);

		return result.rows[0];

	} catch (error) {
		throw new Error("Internal Server Error: " + (error as Error).message);
	}
};

/**
 * Retrieves the count of users that a given user follows.
 *
 * @param {string} user_id - The ID of the user whose following count is being retrieved.
 * @returns {Promise<{ following_of_count: number }>} An object containing the count of users followed.
 * @throws {Error} Throws an error if the following count cannot be retrieved.
 */

export const getFollowingCount = async (user_id: string) => {
	try {
		await pool.query('BEGIN');

		{/* Returns count of all people that user follows*/ }
		const query = 'SELECT COUNT(follower_id) AS following_of_count FROM user_follows WHERE follower_id = $1;';
		const values = [user_id];

		const result = await pool.query(query, values);

		return result.rows[0];

	} catch (error) {
		throw new Error("Internal Server Error: " + (error as Error).message);
	}
};

/**
 * Retrieves a list of users that follow the given user.
 *
 * @param {string} user_id - The ID of the user whose followers are being retrieved.
 * @returns {Promise<{ user_id: string, first_name: string, last_name: string }[] | null>} A list of users following the user or null if none are found.
 * @throws {Error} Throws an error if the follower list cannot be retrieved.
 */

export const getFollowersList = async (user_id: string) => {
	try {
		await pool.query('BEGIN');

		{/* Returns user_id, first and last name of all people that follow a user */ }
		const query = 'SELECT pi.user_id, pi.first_name, pi.last_name FROM user_follows uf INNER JOIN profile_information pi ON uf.follower_id = pi.user_id WHERE uf.following_id = $1;';
		const values = [user_id];

		const result = await pool.query(query, values);

		if (result.rows.length === 0) {
			return null;
		}
		return result.rows;
	} catch (error) {
		throw new Error("Internal Server Error: " + (error as Error).message);
	}
};

/**
 * Checks if a follow relationship exists between two users.
 *
 * @param {string} follower_id - The ID of the user who might be following.
 * @param {string} following_id - The ID of the user who might be followed.
 * @returns {Promise<{ status: number } | 0>} An object with a status of 1 if a follow relationship exists, or 0 if it does not.
 * @throws {Error} Throws an error if the follow relationship check cannot be performed.
 */

export const checkFollowExists = async (follower_id: string, following_id: string) => {
	try {
		await pool.query('BEGIN');

		{/* Returns 1 if the follower follows the specified following*/ }
		const query = 'SELECT 1 AS status FROM user_follows uf WHERE uf.follower_id = $1 AND uf.following_id = $2';
		const values = [follower_id, following_id];

		const result = await pool.query(query, values);

		if (result.rows.length === 0) {
			return 0;
		}
		return result.rows[0];
	} catch (error) {
		throw new Error("Internal Server Error: " + (error as Error).message);
	}
};

module.exports = { createFollowRelation, deleteFollowRelation, getFollowingList, getFollowersList, getFollowingCount, getFollowerCount, checkFollowExists };