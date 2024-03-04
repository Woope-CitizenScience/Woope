const pool = require('../db');

export interface Comment{
    id: number;
    comment: string;
    user_id: number;
    post_id: number;
    parent_id: number;
    created_at: Date;
    is_active: boolean;
    deleted_at: Date;
    likes_count: number;
}

export const createComment = async (comment: string, user_id: number, post_id: number, parent_id: number) => {
    const { rows } = await pool.query(
        'INSERT INTO comments (comment, user_id, post_id, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [comment, user_id, post_id, parent_id]
    );
    return rows[0];
}

export const getComments = async (post_id: number) => {
    const { rows } = await pool.query(
        'SELECT * FROM comments WHERE post_id = $1',
        [post_id]
    );
    return rows;
}

export const updateComment = async (comment_id: number, comment: string) => {
    const { rows } = await pool.query(
        'UPDATE comments SET comment = $1 WHERE comment_id = $2 RETURNING *',
        [comment, comment_id]
    );
    return rows[0];
}

export const deleteComment = async (comment_id: number) => {
    await pool.query(
        'DELETE FROM comments WHERE comment_id = $1',
        [comment_id]
    );
}

export const addLike = async (comment_id: number) => {
    const { rows } = await pool.query(
        'UPDATE comments SET likes_count = likes_count + 1 WHERE comment_id = $1 RETURNING *',
        [comment_id]
    );
    return rows[0];
}

export const removeLike  = async (comment_id: number) => {
    const { rows } = await pool.query(
        'UPDATE comments SET likes_count = likes_count - 1 WHERE comment_id = $1 RETURNING *',
        [comment_id]
    );
    return rows[0];
}