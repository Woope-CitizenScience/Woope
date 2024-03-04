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

const pool = require('../db');
const router = require('express').Router();

// Get all posts
router.get('/posts', async (req: express.Request, res: express.Response) =>{
    try {
        const posts = await getPost();
        res.json(posts);
    } catch (error) {
        res.status(500).json('Internal server error: ${error.message}');
    }
});

// Get a post by ID
router.get('/posts/:id', async (req: express.Request, res: express.Response) => {
    try {
        const post = await getPostById(req.params.id);
        if (post.length === 0) {
            return res.status(404).json('Post not found');
        }
        res.json(post);
    } catch (error) {
        res.status(500).json('Internal server error: ${error.message}');
    }
});

// Get posts by User ID
router.get('/posts/user/:id', async (req: express.Request, res: express.Response) => {
    try {
        const posts = await getPostByUserId(Number(req.params.id));
        if (posts.length === 0) {
            return res.status(404).json('Posts not found');
        }
        res.json(posts);
    } catch (error) {
        res.status(500).json('Internal server error: ${error.message}');
    }
});

// Create a new post
router.post('/posts', async (req: express.Request, res: express.Response) => {
    try {
        const newPostData = {
            user_id: req.body.user_id,
            content: req.body.content,
        };
        const newPost = await createPost(newPostData);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json('Internal server error: ${error.message}');
    }
});

// Update a post
router.put('/posts/:id', async (req: express.Request, res: express.Response) => {
    try {
        const updatedPost = await updatePost(req.body.post_id, req.body.content);
        res.status(201).json(updatedPost);
    } catch (error) {
        res.status(500).json('Internal server error: ${error.message}');
    }
});

// Delete a post
router.delete('/posts/:id', async (req: express.Request, res: express.Response) => {
    try {
        const deletedPost = await deletePost(Number(req.params.id));
        res.status(201).json(deletedPost);
    } catch (error) {
        res.status(500).json('Internal server error: ${error.message}');
    }
});

// Soft delete a post
router.delete('/posts/soft/:id', async (req: express.Request, res: express.Response) => {
    try {
        const softDeletedPost = await softDeletePost(Number(req.params.id));
        res.status(201).json(softDeletedPost);
    } catch (error) {
        res.status(500).json('Internal server error: ${error.message}');
    }
});

module.exports = router;