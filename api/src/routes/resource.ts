import express from 'express';
import { createResource, deleteResource, getResourceById, getResourceInfo, getResourceMedia, getResources, updateResource, insertResourceMedia, deleteResourceMedia, updatePhoto, serverDelete } from '../models/resources';

const router = require('express').Router();
router.post('/create', async(req: express.Request, res: express.Response) => {
    try{
        const {org_id, name, tagline, text_description} = req.body;
        const newPost = await createResource(org_id, name,tagline,text_description);
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
router.get('/getresourcesbyid/:org_id', async(req: express.Request, res: express.Response) => {
    try{
        const response = await getResourceById(Number(req.params.org_id));
        res.status(200).json(response);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.get('/getresourceinfo/:resource_id', async(req: express.Request, res: express.Response) => {
    try{
        const response = await getResourceInfo(Number(req.params.resource_id));
        res.status(200).json(response);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.put('/update', async(req: express.Request, res: express.Response) => {
    try{
        const {resource_id, tagline, text_description} = req.body;
        const edit = await updateResource(resource_id,tagline,text_description);
        res.status(200).json(edit);
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
        const {resource_id, name} = req.body;
        await deleteResource(resource_id, name);
        res.status(204);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.get('/getresourcesmedia/:resource_id', async(req: express.Request, res: express.Response) => {
    try{
        const response = await getResourceMedia(Number(req.params.resource_id));
        res.status(200).json(response);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.post('/insertMedia', async(req: express.Request, res: express.Response) => {
    try{
        const {resource_id, name, file_path} = req.body;
        const newPost = await insertResourceMedia(resource_id,name,file_path);
        res.status(201).json(newPost);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.delete('/deleteMedia', async (req: express.Request, res: express.Response) => {
    try {
        const {media_id} = req.body;
        await deleteResourceMedia(media_id);
        res.status(204);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.delete('/serverDelete', async (req: express.Request, res: express.Response) => {
    try {
        const {path} = req.body;
        await serverDelete(path);
        res.status(204);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
router.put('/updatephoto', async(req: express.Request, res: express.Response) => {
    try{
        const {resource_id, image_path} = req.body;
        const edit = await updatePhoto(resource_id, image_path);
        res.status(200).json(edit);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
module.exports = router;