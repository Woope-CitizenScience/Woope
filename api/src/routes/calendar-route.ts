// import express from 'express';
// import { authenticateToken } from '../middleware/authMiddleware';
// const router = require('express').Router();
// import { createEvent } from "../models/calendar";
//
// router.post('/events', (req: express.Request, res: express.Response) => {
//     const { userId, title, description, location, startTime, endTime } = req.body;
//
//     if (!userId || !title || !description || !location || !startTime || !endTime) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }
//
//     try {
//         const event = await createEvent(userId, title, description, location, new Date(startTime), new Date(endTime));
//         res.status(201).json(event);
//     } catch (error) {
//         res.status(500).json({ error: `Error creating event: ${(error as Error).message}` });
//     }
// });
//
// module.exports = router;