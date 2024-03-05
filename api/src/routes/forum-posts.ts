import {config} from '../config/config'
import express from 'express';
import { 
    getPost,
    getPostById,
    getPostByUserId,
    createPost,
    updatePost,
    deletePost,
    softDeletePost,
 } from '../models/posts';

const router = require('express').Router();

// Get all posts
router.get('/posts', async (req: express.Request, res: express.Response) =>{
    try {
        const posts = await getPost();
        res.status(200).json(posts);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Get a post by ID
router.get('/posts/:id', async (req: express.Request, res: express.Response) => {
    try {
        const post = await getPostById(req.params.id);
        if (post.length === 0) {
            return res.status(404).json('Post not found');
        }
        res.status(200).json(post);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Get posts by User ID
router.get('/posts/user/:id', async (req: express.Request, res: express.Response) => {
    try {
        const posts = await getPostByUserId(Number(req.params.id));
        if (posts.length === 0) {
            return res.status(404).json('Posts not found');
        }
        res.status(200).json(posts);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Create a new post
router.post('/posts', async (req: express.Request, res: express.Response) => {
    try {
        const newPost = await createPost(Number(req.body.user_id), req.body.content);
        res.status(201).json(newPost);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Update a post
router.put('/posts/:id', async (req: express.Request, res: express.Response) => {
    try {
        const updatedPost = await updatePost(req.body.post_id, req.body.content);
        res.status(200).json(updatedPost);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Delete a post
router.delete('/posts/:id', async (req: express.Request, res: express.Response) => {
    try {
        const deletedPost = await deletePost(Number(req.params.id));
        res.status(204).json(deletedPost);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Soft delete a post
router.delete('/posts/soft/:id', async (req: express.Request, res: express.Response) => {
    try {
        const softDeletedPost = await softDeletePost(Number(req.params.id));
        res.status(200).json(softDeletedPost);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

module.exports = router;