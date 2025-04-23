import express from 'express';
import { getEvents, createEvents, getEventInfo, deleteEvent, updateEvent, getDates, getFollowedDates, getDayEvents, createUserEvents, getUserDates} from "../models/events";
const router = require('express').Router();

//get all events
router.get('/getall/:org_id', async(req: express.Request, res: express.Response) => {
    try{
        const orgs = await getEvents(Number(req.params.org_id));
        res.status(200).json(orgs);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }    
});
//create an event
router.post('/create', async(req: express.Request, res: express.Response) => {
    try{
        const {org_id, name, tagline, text_description, time_begin, time_end} = req.body;
        const newPost = await createEvents(org_id, name, tagline, text_description, time_begin, time_end);
        res.status(201).json(newPost);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.get('/geteventinfo/:event_id', async(req: express.Request, res: express.Response) => {
    try{
        const response = await getEventInfo(Number(req.params.event_id));
        res.status(200).json(response);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.delete('/delete', async (req: express.Request, res: express.Response) => {
    try {
        const {event_id, name} = req.body;
        await deleteEvent(event_id, name);
        res.status(204);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.put('/update', async(req: express.Request, res: express.Response) => {
    try{
        const {event_id, tagline, text_description, time_begin, time_end} = req.body;
        const edit = await updateEvent(event_id,tagline,text_description, time_begin, time_end);
        res.status(200).json(edit);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.get('/getdates/:month/:year', async(req: express.Request, res: express.Response) => {
    try{
        const dates = await getDates(Number(req.params.month), Number(req.params.year));
        res.status(200).json(dates);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }    
});
router.get('/getfolloweddates/:month/:year/:user_id', async(req: express.Request, res: express.Response) => {
    try {
        const dates = await getFollowedDates(Number(req.params.month), Number(req.params.year), Number(req.params.user_id));
        res.status(200).json(dates);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.get('/getuserdates/:month/:year/:user_id', async(req: express.Request, res: express.Response) => {
    try {
        const dates = await getUserDates(Number(req.params.month), Number(req.params.year), Number(req.params.user_id));
        res.status(200).json(dates);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.get('/getdayevents/:bottom/:top/', async(req: express.Request, res: express.Response) => {
    try {
        const dates = await getDayEvents(new Date(req.params.bottom), new Date(req.params.top));
        res.status(200).json(dates);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
//create an event
router.post('/createuserevents', async(req: express.Request, res: express.Response) => {
    try{
        const {user_id, name, tagline, text_description, time_begin, time_end} = req.body;
        const newPost = await createUserEvents(user_id, name, tagline, text_description, time_begin, time_end);
        res.status(201).json(newPost);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
module.exports = router;