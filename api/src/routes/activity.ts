import express from "express";
import { logActivity } from "../models/activity";

const router = express.Router();

router.post('/log-activity', async(req: express.Request, res: express.Response) => {
    const { user_id, description } = req.body;

    try {
        const response = await logActivity(user_id, description)
        res.status(201).json(response)
        
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

export default router;