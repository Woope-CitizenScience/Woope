import express from 'express';
import { createResource, getResources } from '../models/resources';

const router = require('express').Router();
router.post('/create', async(req: express.Request, res: express.Response) => {
    try{
        const {name, tagline, text_description} = req.body;
        const newPost = await createResource(name,tagline,text_description);
        res.status(201).json(newPost);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
//get all resources
router.get('/get', async(req: express.Request, res: express.Response) => {
    try{
        const response = await getResources();
        res.status(200).json(response);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }    
});
module.exports = router;