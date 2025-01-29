const pool = require('../db');

export const createComment = async (
    content: string, user_id: 
    number, post_id: number, 
    org_id: number | null
): Promise<Comment> => {
    
    const insertQuery = `
        INSERT INTO comments (content, user_id, post_id, parent_comment_id, org_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const commentResult = await pool.query(insertQuery, [content, user_id, post_id, null, org_id]);
    const newComment = commentResult.rows[0];

    const userQuery = `
        SELECT first_name || ' ' || last_name AS username
        FROM profile_information
        WHERE user_id = $1
    `;
    const userResult = await pool.query(userQuery, [newComment.user_id]);
    const username = userResult.rows[0]?.username;

    return {
        ...newComment,
        username: username 
    };
};


export const getComments = async (post_id: number): Promise<Comment[]> => {
    const { rows } = await pool.query(
        `SELECT comments.*, 
		 CASE 
		 	WHEN comments.org_id IS NOT NULL THEN o.name
			ELSE pi.first_name || ' ' || pi.last_name
		 END AS username
         FROM comments
         JOIN users u ON u.user_id = comments.user_id
         JOIN profile_information pi ON pi.user_id = u.user_id
		 LEFT JOIN organizations o ON comments.org_id = o.org_id
         WHERE comments.post_id = $1 AND comments.is_active = true
         ORDER BY comments.created_at DESC`,
        [post_id]
    );
    return rows;
};


export const updateComment = async (comment_id: number, content: string): Promise<Comment> => {
    const { rows } = await pool.query(
        'UPDATE comments SET content = $1 WHERE comment_id = $2 RETURNING *',
        [content, comment_id]
    );
    return rows[0];
}

export const deleteComment = async (comment_id: number): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM comments WHERE comment_id = $1', [comment_id]);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
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