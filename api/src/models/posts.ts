import { Post, PostWithUsername, PostWithMedia, UserLikedPosts } from "../interfaces/post";

const pool = require('../db');

/**
 * Retrieves posts with associated media and like information.
 * @param {number} currentUserId - The ID of the current user.
 * @returns {Promise<PostWithMedia[]>} A list of posts with media and like information.
 */

export const getPostWithMedia = async (currentUserId: number): Promise<PostWithMedia[]> => {
  const query = `
      SELECT 
          posts.*, 
          profile_information.first_name, 
          profile_information.last_name, 
          COALESCE(COUNT(post_likes.post_id), 0) AS likes_count,
          BOOL_OR(post_likes.user_id = $1) AS user_liked,
          json_agg(
              json_build_object(
                  'media_id', post_media.media_id,
                  'media_type', post_media.media_type,
                  'media_url', post_media.media_url,
                  'created_at', post_media.created_at,
                  'updated_at', post_media.updated_at
              )
              FILTER (WHERE post_media.media_id IS NOT NULL)
          ) AS media
      FROM posts
      JOIN profile_information ON posts.user_id = profile_information.user_id
      LEFT JOIN post_likes ON posts.post_id = post_likes.post_id
      LEFT JOIN post_media ON posts.post_id = post_media.post_id
      GROUP BY posts.post_id, profile_information.first_name, profile_information.last_name
      ORDER BY posts.created_at DESC
  `;
  const response = await pool.query(query, [currentUserId]);
  return response.rows.map((row: any): PostWithUsername => ({
    ...row,
    userName: row.first_name + ' ' + row.last_name,
    likes_count: parseInt(row.likes_count),
    user_liked: Boolean(row.user_liked),
    media: row.media // Includes media array in the returned objects
  }));
};

/**
 * Retrieves posts with user and organization information.
 * @param {number} currentUserId - The ID of the current user.
 * @returns {Promise<UserLikedPosts[]>} A list of posts including user and organization details.
 */

export const getPost = async (currentUserId: number): Promise<UserLikedPosts[]> => {
  const query = `
      SELECT 
          posts.*, 
		      organizations.name AS org_name,
          profile_information.first_name, 
          profile_information.last_name, 
          COALESCE(COUNT(post_likes.post_id), 0) AS likes_count,
          BOOL_OR(post_likes.user_id = $1) AS user_liked
      FROM posts
      JOIN profile_information ON posts.user_id = profile_information.user_id
      LEFT JOIN post_likes ON posts.post_id = post_likes.post_id
	    LEFT JOIN organizations ON posts.org_id = organizations.org_id
      GROUP BY posts.post_id, profile_information.first_name, 
	  		      profile_information.last_name, organizations.name
      ORDER BY posts.created_at DESC
  `;
  const response = await pool.query(query, [currentUserId]);
  return response.rows.map((row: any): PostWithUsername => ({
    ...row,
    userName: row.org_id
      ? row.org_name
      : row.first_name + ' ' + row.last_name, // Combining first name and last name into a single field
    likes_count: parseInt(row.likes_count),
    user_liked: Boolean(row.user_liked) // This will be true if the user liked the post, false otherwise
  }));
};

/**
 * Retrieves a post by its ID.
 * @param {number} id - The ID of the post.
 * @returns {Promise<Post | null>} The post if found, otherwise null.
 */

export const getPostById = async (id: number): Promise<Post[] | null> => {
  const response = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return response.rows.length > 0 ? response.rows[0] : null;
}

/**
 * Retrieves all posts made by a specific user.
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Post[]>} A list of posts created by the user.
 */

export const getPostByUserId = async (user_id: number): Promise<Post[]> => {
  const response = await pool.query('SELECT * FROM posts WHERE user_id = $1', [user_id]);
  return response.rows;
}

/**
 * Creates a new post.
 * @param {number} user_id - The ID of the user creating the post.
 * @param {number | null} org_id - The ID of the organization, if applicable.
 * @param {string} content - The content of the post.
 * @returns {Promise<Post>} The created post.
 */

export const createPost = async (user_id: number, org_id: number | null, content: string): Promise<Post> => {
  try {
    const isActive = true;
    const response = await pool.query(
      'INSERT INTO posts (user_id, content, is_active, org_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, content, isActive, org_id]
    );
    return response.rows[0];
  } catch (error) {
    console.error('Error creating post', error);
    throw error;
  }
}

/**
 * Updates a post's content.
 * @param {number} post_id - The ID of the post to update.
 * @param {string} content - The updated content.
 * @returns {Promise<Post>} The updated post.
 */

export const updatePost = async (post_id: number, content: string): Promise<Post> => {
  try {
    const response = await pool.query(
      'UPDATE posts SET content = $2, is_updated = TRUE, created_at = CURRENT_TIMESTAMP WHERE post_id = $1 RETURNING *',
      [post_id, content]
    );
    return response.rows[0];
  } catch (error) {
    console.error(`Error updating post with id ${post_id}`, error);
    throw error;
  }
};

/**
 * Soft deletes a post by marking it inactive.
 * @param {number} post_id - The ID of the post.
 */

export const softDeletePost = async (post_id: number): Promise<void> => {
  try {
    await pool.query('UPDATE posts SET is_active = FALSE WHERE post_id = $1', [post_id]);
  } catch (error) {
    console.error(`Error soft deleting post with id ${post_id}`, error);
    throw error;
  }
}

/**
 * Permanently deletes a post and its associated likes.
 * @param {number} post_id - The ID of the post.
 */

export const deletePost = async (post_id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    // Start a transaction
    await client.query('BEGIN');

    // Delete related entries from post_likes first
    await client.query('DELETE FROM post_likes WHERE post_id = $1', [post_id]);

    // Delete the post
    await client.query('DELETE FROM posts WHERE post_id = $1', [post_id]);

    // Commit the transaction
    await client.query('COMMIT');
  } catch (error) {
    // If an error occurs, rollback the transaction
    await client.query('ROLLBACK');
    console.error(`Error deleting post with id ${post_id}`, error);
    throw error;
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

/**
 * Adds a like to a post.
 * @param {number} post_id - The ID of the post.
 * @param {number} user_id - The ID of the user liking the post.
 */

export const addPostLike = async (post_id: number, user_id: number): Promise<void> => {
  try {
    await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [post_id, user_id]);
  } catch (error) {
    console.error(`Error adding like to post with id ${post_id}`, error);
    throw error;
  }
}

/**
 * Removes a like from a post.
 * @param {number} post_id - The ID of the post.
 * @param {number} user_id - The ID of the user unliking the post.
 */

export const removePostLike = async (post_id: number, user_id: number): Promise<void> => {
  try {
    await pool.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [post_id, user_id]);
  } catch (error) {
    console.error(`Error removing like from post with id ${post_id}`, error);
    throw error;
  }
}

export const getPostLikes = async (post_id: number): Promise<number> => {
  try {
    const response = await pool.query('SELECT COUNT(*) FROM post_likes WHERE post_id = $1', [post_id]);
    return response.rows[0].count;
  } catch (error) {
    console.error(`Error getting likes for post with id ${post_id}`, error);
    throw error;
  }
}

export const getUserLikedPosts = async (user_id: number): Promise<Post[]> => {
  try {
    const response = await pool.query('SELECT * FROM posts WHERE post_id IN (SELECT post_id FROM post_likes WHERE user_id = $1)', [user_id]);
    return response.rows;
  } catch (error) {
    console.error(`Error getting liked posts for user with id ${user_id}`, error);
    throw error;
  }
}

//search posts on admin site
export const searchPosts = async (query: string): Promise<Post[]> => {
  try {
    const searchQuery = `%${query}%`;
    const response = await pool.query(
      'SELECT * FROM posts WHERE content ILIKE $1 ORDER BY created_at DESC',
      [searchQuery]
    );
    return response.rows;
  } catch (error) {
    console.error('Error searching posts', error);
    throw error;
  }
}