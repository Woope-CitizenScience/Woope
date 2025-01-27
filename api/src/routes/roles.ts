import express from 'express';
import { getRoles } from '../models/roles';

const router = require('express').Router();

router.get('/roles', async(req: express.Request, res: express.Response) => {
    try{
        const roles = await getRoles();
        res.status(200).json(roles);
    }
    catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
}) 

module.exports = router;