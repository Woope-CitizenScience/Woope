const pool = require('../db');

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

export const getFollowingList = async (user_id: string) => {
	try {
		await pool.query('BEGIN');

        {/* Returns user_id first and last name of all people that the user follows */}
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

export const getFollowerCount = async (user_id: string) => {
	try {
		await pool.query('BEGIN');


        {/* Returns count of all people that follow the user */}
		const query = 'SELECT COUNT(following_id) AS follower_of_count FROM user_follows WHERE following_id = $1;';
		const values = [user_id];


		const result = await pool.query(query, values);


		return result.rows[0];


	} catch (error) {
		throw new Error("Internal Server Error: " + (error as Error).message);
	}
};

export const getFollowingCount = async (user_id: string) => {
	try {
		await pool.query('BEGIN');

        {/* Returns count of all people that user follows*/}
		const query = 'SELECT COUNT(follower_id) AS following_of_count FROM user_follows WHERE follower_id = $1;';
		const values = [user_id];


		const result = await pool.query(query, values);


		return result.rows[0];


	} catch (error) {
		throw new Error("Internal Server Error: " + (error as Error).message);
	}
};

export const getFollowersList = async (user_id: string) => {
    try{
        await pool.query('BEGIN');

        {/* Returns user_id, first and last name of all people that follow a user */}
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

export const checkFollowExists = async (follower_id: string, following_id: string) => {
    try{
        await pool.query('BEGIN');

        {/* Returns 1 if the follower follows the specified following*/}
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