import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
const router = require('express').Router();
import {createEvent, modifyEvent, getEvent, getEventOnDate, deleteEvent} from "../models/calendar";

//createEvent
router.post('/events', authenticateToken, async (req: express.Request, res: express.Response) => {
    const { event_id, user_id, title, description, location, startTime, endTime, isActive } = req.body;

    if (!event_id || !user_id || !title || !description || !location || !startTime || !endTime || isActive === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const event = await createEvent(event_id, user_id, title, description, location, new Date(startTime), new Date(endTime), isActive);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: `Error creating event: ${(error as Error).message}` });
    }
});

//getEvent
router.get('/events/:eventId', authenticateToken, async (req: express.Request, res: express.Response) => {
    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.body.user_id);

    if (!eventId || !userId) {
        return res.status(400).json({ error: 'Event ID and User ID are required' });
    }

    try {
        const event = await getEvent(eventId, userId);
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Error getting event: ${(error as Error).message}` });
    }
});




//modify
router.put('/events/:eventId',authenticateToken, async (req: express.Request, res: express.Response) => {
    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.body.user_id);
    const { title, description, location, startTime, endTime } = req.body;

    if (!eventId || !userId || !title || !description || !location || !startTime || !endTime) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await modifyEvent(eventId, userId, title, description, location, new Date(startTime), new Date(endTime));
        res.status(200).json({ message: 'Event modified successfully' });
    } catch (error) {
        res.status(500).json({ error: `Error modifying event: ${(error as Error).message}` });
    }
});

//delete
router.delete('events/event_id',authenticateToken, async (req: express.Request, res: express.Response) => {
    const eventId = parseInt(req.params.event_id);
    const userId = parseInt(req.body.user_id);

    if (!eventId || !userId) {
        return res.status(400).json({ error: 'Event ID and User ID are required' });
    }

    try {
        const isDeleted = await deleteEvent(eventId, userId);
        if (isDeleted) {
            res.status(200).json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ error: 'Event not found or not authorized to delete' });
        }
    } catch (error) {
        res.status(500).json({ error: `Error deleting event: ${(error as Error).message}` });
    }


});





module.exports = router;