import express from 'express';
import { createReport } from '../models/reports';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const newReport = await createReport(req.body.label, req.body.title, req.body.description);
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

module.exports = router;