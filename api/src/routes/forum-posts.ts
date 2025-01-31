import express from 'express';
import { 
    getPost,
    getPostById,
    getPostByUserId,
    createPost,
    updatePost,
    deletePost,
    softDeletePost,
    addPostLike,
    removePostLike,
    getPostLikes,
    getPostWithMedia
 } from '../models/posts';

const router = require('express').Router();

router.get('/postswithmedia/:id/', async (req: express.Request, res: express.Response) =>{
    try {
        const userId = Number(req.params.id);
        const posts = await getPostWithMedia(userId);
        res.status(200).json(posts);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

// Get all posts
router.get('/posts/:id', async (req: express.Request, res: express.Response) =>{
    try {
        const userId = Number(req.params.id);
        const posts = await getPost(userId);
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
router.get('/:id/posts', async (req: express.Request, res: express.Response) => {
    try {
        const post = await getPostById(Number(req.params.id));
        if (!post || post.length === 0) {
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
        const newPost = await createPost(Number(req.body.user_id), req.body.org_id, req.body.content);
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
        const updatedPost = await updatePost(Number(req.params.id), req.body.content);
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
        res.status(204);
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

router.post('/posts/:id/like', async (req: express.Request, res: express.Response) => {
    try {
        const postId = Number(req.params.id);
        const userId = Number(req.body.user_id);
        const like = await addPostLike(postId, userId);
        res.status(201).json({ message: "Like added successfully" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Internal server error: ${error.message}` });
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

router.delete('/posts/:id/like', async (req: express.Request, res: express.Response) => {
    try {
        const postId = Number(req.params.id);
        const userId = Number(req.body.user_id);
        const like = await removePostLike(postId, userId);
        res.status(200).json({ message: "Like removed successfully" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Internal server error: ${error.message}` });
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

router.get('/posts/:id/like', async (req: express.Request, res: express.Response) => {
    try {
        const postId = Number(req.params.id);
        const likes = await getPostLikes(postId);
        res.status(200).json(likes);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

router.get('/posts/user/:id/likes', async (req: express.Request, res: express.Response) =>{
    try {
        const userId = Number(req.params.id);
        const likes = await getPostLikes(userId);
        res.status(200).json(likes);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    } 
    return; 
})

module.exports = router;