import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
const router = require('express').Router();
import {createEvent, modifyEvent, getEvent, getEventOnDate, deleteEvent, getAllEvents} from "../models/calendar";

//createEvent
router.post('/create', async (req: express.Request, res: express.Response) => {
    const { user_id, title, description, location, startTime, endTime} = req.body;

    if (!user_id || !title || !description || !location || !startTime || !endTime) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const event = await createEvent(user_id, title, description, location, new Date(startTime), new Date(endTime));
        res.status(201).json({message: "Event created successfully!"});
    } catch (error) {
        res.status(500).json({ error: `Error creating event: ${(error as Error).message}` });
    }
});

// get all events
router.get('/getAllEvents', async (req: express.Request, res: express.Response) => {
    try {
        const allEvents = await getAllEvents();
        res.status(200).json(allEvents);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message});
    }
});


//getEvent
router.get('/:eventId', async (req: express.Request, res: express.Response) => {
    const eventId = parseInt(req.params.eventId);


    if (!eventId) {
        return res.status(400).json({ error: 'Event ID required' });
    }

    try {
        const event = await getEvent(eventId);
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ error: (error as Error).message} );
    }
});

//modify
router.put('/:eventId', async (req: express.Request, res: express.Response) => {
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
router.delete('/:event_id/:user_id',async (req: express.Request, res: express.Response) => {
    const eventId = parseInt(req.params.event_id);
    const userId = parseInt(req.params.user_id);

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



// get event on specific date
router.get('/onDate/:selectedDate', async (req: express.Request, res: express.Response) => {
        // validates that the user's input is in YYYY-MM-DD format
        const validateDateFormat = /^\d{4}-\d{2}-\d{2}$/;
        const selectedDate = req.params.selectedDate;

        if(!selectedDate)
                return res.status(400).json({ error: 'You need to select a specific date.'})
        else if(!validateDateFormat.test(selectedDate))
                return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD format.'})

        try {
            const retrievedEvents = await getEventOnDate(selectedDate);
            if (retrievedEvents) {
                res.status(202).json(retrievedEvents);
            } else {
                res.status(204).json({message: `No events found on ${selectedDate}`});
            }
        } catch (error) {
            res.status(500).json( { error: `${ (error as Error).message }`})
        }
});
module.exports = router;