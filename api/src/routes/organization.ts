import express from 'express';
import { getCategory, getOrganizationById, getOrganizations,getOrganizationsFollowed,getOrganizationsWithCategory } from '../models/organizations';

const router = require('express').Router();

//get all organizations
router.get('/organizations', async(req: express.Request, res: express.Response) => {
    try{
        const orgs = await getOrganizations();
        res.status(200).json(orgs);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }    
});
//get all categories
router.get('/category', async(req: express.Request, res:express.Response) => {
    try{
        const category = await getCategory();
        res.status(200).json(category);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
//get all organizations by specific category
router.get('/organizationsbycategory/:category_name', async(req: express.Request, res: express.Response) => {
    try {
        const orgs = await getOrganizationsWithCategory(req.params.category_name);
        res.status(200).json(orgs);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.get('/organizationsbyfollowed/:user_id', async(req: express.Request, res: express.Response) => {
    try {
        const orgs = await getOrganizationsFollowed(Number(req.params.user_id));
        res.status(200).json(orgs);
    }catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.get('/organizationsbyid/:org_id', async(req: express.Request, res: express.Response) => {
    try{
        const org = await getOrganizationById(Number(req.params.org_id));
        res.status(200).json(org);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
module.exports = router;