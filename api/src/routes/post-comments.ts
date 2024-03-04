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

const pool = require('../db');
const router = express.Router();

// Get comments for post ID
router.get('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const comments = await getComments(Number(req.params.id));
        res.json(comments);
    } catch (error) {
        res.status(500).json('Internal server error: ${error.message}');
    }
});

module.exports = router;