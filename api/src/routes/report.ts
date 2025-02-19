import express from 'express';
import { createReport } from '../models/reports';

const router = express.Router();

router.post('/create', async (req, res) => {
    console.log('📩 Received POST request at /report/create');
    console.log('🔍 Request body:', req.body);

    try {
        const newReport = await createReport(req.body.label, req.body.title, req.body.description);
        console.log('✅ Successfully created report:', newReport);
        res.status(201).json(newReport);
    } catch (error) {
        console.error('❌ Error in /report/create:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

module.exports = router;