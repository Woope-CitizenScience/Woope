const pool = require('../db');

export const createComment = async (content: string, user_id: number, post_id: number, parent_comment_id: number): Promise<Comment> => {
    const { rows } = await pool.query(
        'INSERT INTO comments (content, user_id, post_id, parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [content, user_id, post_id, parent_comment_id]
    );
    return rows[0];
}

export const getComments = async (post_id: number): Promise<Comment[]> => {
    const { rows } = await pool.query(
        'SELECT * FROM comments WHERE post_id = $1',
        [post_id]
    );
    return rows;
}

export const updateComment = async (comment_id: number, content: string): Promise<Comment> => {
    const { rows } = await pool.query(
        'UPDATE comments SET content = $1 WHERE comment_id = $2 RETURNING *',
        [content, comment_id]
    );
    return rows[0];
}

export const deleteComment = async (comment_id: number): Promise<void> => {
    console.log("Delete comment called");
    await pool.query(
        'DELETE FROM comments WHERE comment_id = $1',
        [comment_id]
    );
}

export const addCommentLike = async (comment_id: number): Promise<Comment> => {
    const { rows } = await pool.query(
        'UPDATE comments SET likes_count = likes_count + 1 WHERE comment_id = $1 RETURNING *',
        [comment_id]
    );
    return rows[0];
}

export const removeCommentLike  = async (comment_id: number): Promise<Comment> => {
    const { rows } = await pool.query(
        'UPDATE comments SET likes_count = likes_count - 1 WHERE comment_id = $1 RETURNING *',
        [comment_id]
    );
    return rows[0];
}