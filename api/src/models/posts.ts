import { Post, PostWithUsername, UserLikedPosts} from "../interfaces/post";

const pool = require('../db');

export const getPost = async (currentUserId: number): Promise<UserLikedPosts[]> => {
  const query = `
      SELECT 
          posts.*, 
          profile_information.first_name, 
          profile_information.last_name, 
          COALESCE(COUNT(post_likes.post_id), 0) AS likes_count,
          BOOL_OR(post_likes.user_id = $1) AS user_liked
      FROM posts
      JOIN profile_information ON posts.user_id = profile_information.user_id
      LEFT JOIN post_likes ON posts.post_id = post_likes.post_id
      GROUP BY posts.post_id, profile_information.first_name, profile_information.last_name
      ORDER BY posts.created_at DESC
  `;
  const response = await pool.query(query, [currentUserId]);
  return response.rows.map((row: any): PostWithUsername => ({
      ...row,
      userName: row.first_name + ' ' + row.last_name, // Combining first name and last name into a single field
      likes_count: parseInt(row.likes_count),
      user_liked: Boolean(row.user_liked) // This will be true if the user liked the post, false otherwise
  }));
};

export const getPostById = async (id: number): Promise<Post[]> =>{
    const response = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return response.rows.length > 0 ? response.rows[0] : null;
}

export const getPostByUserId = async (user_id: number): Promise<Post[]> =>{
    const response = await pool.query('SELECT * FROM posts WHERE user_id = $1', [user_id]);
    return response.rows;
}

export const createPost = async (user_id: Number, content: string): Promise<Post> => {
    try {
      const isActive = true;
      const response = await pool.query(
        'INSERT INTO posts (user_id, content, is_active) VALUES ($1, $2, $3) RETURNING *', 
        [user_id, content, isActive]
      );
      return response.rows[0];
    } catch (error) {
      console.error('Error creating post', error);
      throw error;
    }
  }

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

export const softDeletePost = async (post_id: number): Promise<void> => {
  try {
    await pool.query('UPDATE posts SET is_active = FALSE WHERE post_id = $1', [post_id]);
  } catch (error) {
    console.error(`Error soft deleting post with id ${post_id}`, error);
    throw error;
  }
}

export const deletePost = async (post_id: number): Promise<void> => {
  try {
    await pool.query('DELETE FROM posts WHERE post_id = $1', [post_id]);
  } catch (error) {
    console.error(`Error deleting post with id ${post_id}`, error);
    throw error;
  }
}

export const addPostLike = async (post_id: number, user_id: number): Promise<void> => {
  try {
    await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [post_id, user_id]);
  } catch (error) {
    console.error(`Error adding like to post with id ${post_id}`, error);
    throw error;
  }
}

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