import {config} from '../config/config'
import express from 'express';
import {
    getComments,
    createComment,
    deleteComment,
    updateComment,
    addLike,
    removeLike,
} from '../models/comments';

const router = express.Router();

// Get comments for post ID
router.get('/comments/:id', async (req: express.Request, res: express.Response) => {
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
router.post('/comments/create', async (req: express.Request, res: express.Response) => {
    try {
        const comment = await createComment(req.params.comment,
            Number(req.params.user_id),
            Number(req.params.post_id), 
            Number(req.params.parent_id));
        res.status(201).json(comment);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Update comment content
router.put('/comments/update', async (req: express.Request, res: express.Response) => {
    try {
        const comment = await updateComment(Number(req.params.id), req.params.comment);
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
router.delete('/comments/:id', async (req: express.Request, res: express.Response) => {
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
router.put('/comments/like', async (req: express.Request, res: express.Response) => {
    try {
        const comment = await addLike(Number(req.params.id));
        res.status(200).json(comment);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Remove like to comment
router.put('/comments/unlike', async (req: express.Request, res: express.Response) => {
    try {
        const comment = await removeLike(Number(req.params.id));
        res.status(200).json(comment);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

module.exports = router;