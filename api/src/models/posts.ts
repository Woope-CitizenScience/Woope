const pool = require('../db');

export interface Post{
    post_id: number,
    user_id: number,
    content: string,
    created_at: Date,
    is_updated: boolean,
    comments_count: number, 
    likes_count: number,
    is_active: boolean,
}

export const getPost = async () =>{
    const response = await pool.query('SELECT * FROM post');
    return response.rows;
}

export const getPostById = async (id: string) =>{
    const response = await pool.query('SELECT * FROM post WHERE id = $1', [id]);
    return response.rows;
}

export const getPostByUserId = async (user_id: number) =>{
    const response = await pool.query('SELECT * FROM post WHERE user_id = $1', [user_id]);
    return response.rows;
}

export const createPost = async (post: Omit<Post, 'post_id' | 'created_at' | 'is_updated' | 'comments_count' | 'likes_count' | 'is_active'>): Promise<Post> => {
    try {
      const { user_id, content } = post;
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
  