import express from 'express';
import {
    getComments,
    createComment,
    deleteComment,
    updateComment,
    addCommentLike,
    removeCommentLike,
} from '../models/comments';

const router = express.Router();

// Get comments for post ID
router.get('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const comments = await getComments(Number(req.params.id));
        res.status(200).json(comments);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Create a new comment
router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const { content, user_id, post_id, parent_id } = req.body;
        const newComment = await createComment(content, user_id, post_id, parent_id);
        res.status(201).json(newComment);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Update comment content
router.put('/:comment_id', async (req: express.Request, res: express.Response) => {
    try {
        const comment = await updateComment(Number(req.params.comment_id), req.body.content);
        res.status(200).json(comment);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Delete comment
router.delete('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const comment = await deleteComment(Number(req.params.id));
        res.status(204).json(comment);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Add like to comment
router.post('/:id/like', async (req: express.Request, res: express.Response) => {
    try {
        const comment = await addCommentLike(Number(req.params.id));
        res.status(201).json(comment);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Remove like to comment
router.delete('/:id/unlike', async (req: express.Request, res: express.Response) => {
    try {
        await removeCommentLike(Number(req.params.id));
        res.status(204).end();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

module.exports = router;