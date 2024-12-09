import { Post, PostWithUsername, PostWithMedia, UserLikedPosts} from "../interfaces/post";

const pool = require('../db');

/**
 * Retrieves posts with associated media, like count, and user like status.
 *
 * This function fetches a list of posts along with their associated media files,
 * the full name of the user who created each post, the total number of likes,
 * and whether the current user has liked each post. The posts are ordered by creation date in descending order.
 *
 * @param {number} currentUserId - The ID of the current user, used to check if they liked each post.
 * @returns {Promise<PostWithMedia[]>} A promise that resolves to an array of posts, each containing post details, media information, like count, user like status, and the full name of the post creator.
 * @throws {Error} Throws an error if the post retrieval fails.
 *
 * @example
 * // Get posts with media details for a user with ID 1
 * getPostWithMedia(1)
 *   .then(posts => console.log(posts))
 *   .catch(error => console.error(error.message));
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
 * Retrieves a list of posts with like count, user like status, and creator's full name.
 *
 * This function fetches a list of posts along with the first and last name of the user
 * who created each post, the total number of likes each post has received, and whether
 * the current user has liked each post. The posts are ordered by creation date in descending order.
 *
 * @param {number} currentUserId - The ID of the current user, used to check if they liked each post.
 * @returns {Promise<UserLikedPosts[]>} A promise that resolves to an array of posts, each containing post details, like count, user like status, and the full name of the post creator.
 * @throws {Error} Throws an error if the post retrieval fails.
 *
 * @example
 * // Get posts with like details for a user with ID 1
 * getPost(1)
 *   .then(posts => console.log(posts))
 *   .catch(error => console.error(error.message));
 */
export const getPost = async (currentUserId: number): Promise<UserLikedPosts[]> => {
  const query = `
      SELECT 
          posts.*, 
          profile_information.first_name, 
          profile_information.last_name,
		      organizations.name,
          COALESCE(COUNT(post_likes.post_id), 0) AS likes_count,
          BOOL_OR(post_likes.user_id = $1) AS user_liked
      FROM posts
      JOIN profile_information ON posts.user_id = profile_information.user_id
      LEFT JOIN post_likes ON posts.post_id = post_likes.post_id
	    LEFT JOIN organizations ON organizations.org_id = posts.org_id
      GROUP BY organizations.name, posts.post_id, profile_information.first_name, profile_information.last_name
      ORDER BY posts.created_at DESC
  `;
  const response = await pool.query(query, [currentUserId]);
  return response.rows.map((row: any): PostWithUsername => ({
      ...row,
      userName: row.org_id !== null ? row.name : row.first_name + ' ' + row.last_name, // Combining first name and last name into a single field
      likes_count: parseInt(row.likes_count),
      user_liked: Boolean(row.user_liked) // This will be true if the user liked the post, false otherwise
  }));
};

/**
 * Retrieves a post by its ID.
 *
 * This function fetches a single post based on the provided post ID. If the post exists,
 * it returns the post data; otherwise, it returns `null`.
 *
 * @param {number} id - The ID of the post to retrieve.
 * @returns {Promise<Post | null>} A promise that resolves to the post object if found, or `null` if the post does not exist.
 * @throws {Error} Throws an error if the retrieval process fails.
 *
 * @example
 * // Get a post with ID 1
 * getPostById(1)
 *   .then(post => console.log(post))
 *   .catch(error => console.error(error.message));
 */
export const getPostById = async (id: number): Promise<Post[]> =>{
    const response = await pool.query('SELECT * FROM posts WHERE post_id = $1', [id]);
    return response.rows.length > 0 ? response.rows[0] : null;
}

/**
 * Retrieves all posts made by a user based on their user ID.
 *
 * This function fetches all posts that belong to a specific user, identified by the provided user ID.
 * The function returns an array of posts, or an empty array if the user has not made any posts.
 *
 * @param {number} user_id - The ID of the user whose posts are to be retrieved.
 * @returns {Promise<Post[]>} A promise that resolves to an array of posts made by the user. If the user has no posts, an empty array is returned.
 * @throws {Error} Throws an error if the retrieval process fails.
 *
 * @example
 * // Get all posts made by a user with ID 1
 * getPostByUserId(1)
 *   .then(posts => console.log(posts))
 *   .catch(error => console.error(error.message));
 */
export const getPostByUserId = async (user_id: number): Promise<Post[]> =>{
    const response = await pool.query('SELECT * FROM posts WHERE user_id = $1', [user_id]);
    return response.rows;
}

/**
 * Creates a new post for a specified user.
 *
 * This function inserts a new post into the `posts` table with the provided user ID and content.
 * The post is set to an active state (`is_active = true`) by default. The created post object
 * is then returned.
 *
 * @param {number} user_id - The ID of the user creating the post.
 * @param {string} content - The content of the post to be created.
 * @returns {Promise<Post>} A promise that resolves to the newly created post object.
 * @throws {Error} Throws an error if the post creation fails.
 *
 * @example
 * // Create a post for user with ID 1
 * createPost(1, 'This is a new post')
 *   .then(post => console.log(post))
 *   .catch(error => console.error('Error creating post:', error));
 */
export const createPost = async (user_id: Number, content: string, org_id: number | null): Promise<Post> => {
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
 * Updates the content of an existing post.
 *
 * This function updates the `content` of a post with the specified `post_id`. It also marks the post
 * as updated (`is_updated = TRUE`) and sets the `created_at` timestamp to the current time. The updated
 * post object is returned.
 *
 * @param {number} post_id - The ID of the post to be updated.
 * @param {string} content - The new content for the post.
 * @returns {Promise<Post>} A promise that resolves to the updated post object.
 * @throws {Error} Throws an error if the post update fails.
 *
 * @example
 * // Update the content of a post with ID 1
 * updatePost(1, 'Updated post content')
 *   .then(post => console.log(post))
 *   .catch(error => console.error('Error updating post:', error));
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
 * Soft deletes a post by marking it as inactive.
 *
 * This function performs a "soft delete" by updating the `is_active` flag to `FALSE` for the specified post ID.
 * The post is not permanently removed from the database, but will be treated as inactive.
 *
 * @param {number} post_id - The ID of the post to be soft deleted.
 * @returns {Promise<void>} A promise that resolves when the post has been successfully marked as inactive.
 * @throws {Error} Throws an error if the soft delete operation fails.
 *
 * @example
 * // Soft delete a post with ID 1
 * softDeletePost(1)
 *   .then(() => console.log('Post deleted'))
 *   .catch(error => console.error('Error deleting post:', error));
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
 * Permanently deletes a post and its related entries from the database.
 *
 * This function performs a full delete of a post by first removing all related entries from the `post_likes` table
 * and then deleting the post from the `posts` table. It uses a transaction to ensure that both deletions are performed
 * atomically. If an error occurs, the transaction is rolled back to maintain database integrity.
 *
 * @param {number} post_id - The ID of the post to be deleted.
 * @returns {Promise<void>} A promise that resolves when the post and related data have been successfully deleted.
 * @throws {Error} Throws an error if the deletion process fails or if the transaction is rolled back.
 *
 * @example
 * // Permanently delete a post with ID 1 and its likes
 * deletePost(1)
 *   .then(() => console.log('Post deleted successfully'))
 *   .catch(error => console.error('Error deleting post:', error));
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
 * Adds a like to a post by a specific user.
 *
 * This function inserts a new record into the `post_likes` table to indicate that the user has liked the specified post.
 * It associates the `post_id` with the `user_id` to track which user liked the post.
 *
 * @param {number} post_id - The ID of the post to which the like is being added.
 * @param {number} user_id - The ID of the user who is liking the post.
 * @returns {Promise<void>} A promise that resolves when the like has been successfully added.
 * @throws {Error} Throws an error if adding the like fails.
 *
 * @example
 * // Add a like to the post with ID 1 by the user with ID 2
 * addPostLike(1, 2)
 *   .then(() => console.log('Like added successfully'))
 *   .catch(error => console.error('Error adding like:', error));
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
 * Removes a like from a post by a specific user.
 *
 * This function deletes the record from the `post_likes` table that tracks the user's like on the specified post.
 * It removes the relationship between the `post_id` and `user_id`, effectively unliking the post.
 *
 * @param {number} post_id - The ID of the post from which the like is being removed.
 * @param {number} user_id - The ID of the user who is removing the like.
 * @returns {Promise<void>} A promise that resolves when the like has been successfully removed.
 * @throws {Error} Throws an error if removing the like fails.
 *
 * @example
 * // Remove a like from the post with ID 1 by the user with ID 2
 * removePostLike(1, 2)
 *   .then(() => console.log('Like removed successfully'))
 *   .catch(error => console.error('Error removing like:', error));
 */
export const removePostLike = async (post_id: number, user_id: number): Promise<void> => {
  try {
    await pool.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [post_id, user_id]);
  } catch (error) {
    console.error(`Error removing like from post with id ${post_id}`, error);
    throw error;
  }
}

/**
 * Retrieves the number of likes for a specified post.
 *
 * This function counts the total number of likes associated with a given post by querying the `post_likes` table.
 * It returns the number of users who have liked the specified post.
 *
 * @param {number} post_id - The ID of the post for which to retrieve the like count.
 * @returns {Promise<number>} A promise that resolves to the total count of likes for the specified post.
 * @throws {Error} Throws an error if retrieving the like count fails.
 *
 * @example
 * // Get the number of likes for the post with ID 1
 * getPostLikes(1)
 *   .then(likesCount => console.log('Post has', likesCount, 'likes'))
 *   .catch(error => console.error('Error getting likes:', error));
 */
export const getPostLikes = async (post_id: number): Promise<number> => {
  try {
    const response = await pool.query('SELECT COUNT(*) FROM post_likes WHERE post_id = $1', [post_id]);
    return response.rows[0].count;
  } catch (error) {
    console.error(`Error getting likes for post with id ${post_id}`, error);
    throw error;
  }
}

/**
 * Retrieves all posts liked by a specific user.
 *
 * This function queries the `post_likes` table to find all posts that the specified user has liked, 
 * and then retrieves the corresponding posts from the `posts` table. It returns a list of posts 
 * that the user has interacted with by liking them.
 *
 * @param {number} user_id - The ID of the user whose liked posts are being retrieved.
 * @returns {Promise<Post[]>} A promise that resolves to an array of posts liked by the user.
 * @throws {Error} Throws an error if retrieving the liked posts fails.
 *
 * @example
 * // Get all posts liked by the user with ID 2
 * getUserLikedPosts(2)
 *   .then(likedPosts => console.log('Liked posts:', likedPosts))
 *   .catch(error => console.error('Error getting liked posts:', error));
 */
export const getUserLikedPosts = async (user_id: number): Promise<Post[]> => {
  try {
    const response = await pool.query('SELECT * FROM posts WHERE post_id IN (SELECT post_id FROM post_likes WHERE user_id = $1)', [user_id]);
    return response.rows;
  } catch (error) {
    console.error(`Error getting liked posts for user with id ${user_id}`, error);
    throw error;
  }
}