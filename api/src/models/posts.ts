import { Post } from "../interfaces/post";

const pool = require('../db');

export const getPost = async (): Promise<Post[]> =>{
    const response = await pool.query('SELECT * FROM post');
    return response.rows;
}

export const getPostById = async (id: number): Promise<Post[]> =>{
    const response = await pool.query('SELECT * FROM post WHERE id = $1', [id]);
    return response.rows.length > 0 ? response.rows[0] : null;
}

export const getPostByUserId = async (user_id: number): Promise<Post[]> =>{
    const response = await pool.query('SELECT * FROM post WHERE user_id = $1', [user_id]);
    return response.rows;
}

export const createPost = async (user_id: Number, content: string): Promise<Post> => {
    try {
      const isActive = true;
      const response = await pool.query(
        'INSERT INTO post (user_id, content, is_active) VALUES ($1, $2, $3) RETURNING *', 
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
    const response = await pool.query('UPDATE post SET content = $2, is_updated = TRUE WHERE post_id = $1 RETURNING *', [post_id, content]);
    return response.rows[0];
  } catch (error) {
    console.error(`Error updating post with id ${post_id}`, error);
    throw error;
  }
}

export const softDeletePost = async (post_id: number): Promise<void> => {
  try {
    await pool.query('UPDATE post SET is_active = FALSE WHERE post_id = $1', [post_id]);
  } catch (error) {
    console.error(`Error soft deleting post with id ${post_id}`, error);
    throw error;
  }
}

export const deletePost = async (post_id: number): Promise<void> => {
  try {
    await pool.query('DELETE FROM post WHERE post_id = $1', [post_id]);
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