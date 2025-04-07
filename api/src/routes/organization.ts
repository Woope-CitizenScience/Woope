import express from 'express';
import {checkFollowed, createOrganization, deleteOrganization, featureOrganization, followOrganization, getCategory, getFeaturedOrganizations, getOrganizationById, getOrganizationByName, getOrganizations,getOrganizationsFollowed,getOrganizationsWithCategory, getOrganizationsWithCategoryId, removeFeature, unfollow, updateOrganization } from '../models/organizations';
import { requireOwnershipOrPermission,  } from '../middleware/requireOwnershipOrPermission';
import { authenticateToken, requirePermission } from '../middleware/authMiddleware';
const router = require('express').Router();

//get all organizations
router.get('/organizations', authenticateToken, async(req: express.Request, res: express.Response) => {
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
router.get('/category', authenticateToken,  async(req: express.Request, res:express.Response) => {
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
router.get('/organizationsbycategory/:category_name', authenticateToken, async(req: express.Request, res: express.Response) => {
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
router.get('/organizationsbycategoryid/:category_id', authenticateToken, async(req: express.Request, res: express.Response) => {
    try {
        const orgs = await getOrganizationsWithCategoryId(Number(req.params.category_id));
        res.status(200).json(orgs);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.get('/organizationsbyfollowed/:user_id', authenticateToken, async(req: express.Request, res: express.Response) => {
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
router.get('/organizationsbyid/:org_id', authenticateToken, async(req: express.Request, res: express.Response) => {
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
router.get('/organizationsbyname/:name', authenticateToken, async(req: express.Request, res: express.Response) => {
    try{
        const org = await getOrganizationByName(req.params.name);
        res.status(200).json(org);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
router.get('/featuredorganizations', authenticateToken, async(req: express.Request, res: express.Response) => {
    try{
        const org = await getFeaturedOrganizations();
        res.status(200).json(org);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
router.post('/create', authenticateToken, requirePermission('edit_organization'), async(req: express.Request, res: express.Response) => {
    try{
        const {name, tagline, text_description} = req.body;
        const newPost = await createOrganization(name,tagline,text_description);
        res.status(201).json(newPost);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
router.post('/follow', async(req: express.Request, res: express.Response) => {
    try{
        const {user_id, org_id} = req.body;
        const newFollow = await followOrganization(user_id,org_id);
        res.status(201).json(newFollow);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.put('/update', authenticateToken, requirePermission('edit_all_events'),  async(req: express.Request, res: express.Response) => {
    try{
        const {name, tagline, text_description} = req.body;
        const edit = await updateOrganization(name,tagline,text_description);
        res.status(200).json(edit);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
router.put('/setfeatured', authenticateToken, requirePermission('edit_organization'), async(req: express.Request, res: express.Response) => {
    try{
        const {name} = req.body;
        const edit = await featureOrganization(name);
        res.status(200).json(edit);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
router.put('/removefeatured', authenticateToken, requirePermission('edit_organization'), async(req: express.Request, res: express.Response) => {
    try{
        const {name} = req.body
        const edit = await removeFeature(name);
        res.status(200).json(edit);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
router.put('/checkfollow', authenticateToken, async(req: express.Request, res: express.Response) => {
    try{
        const{user_id, org_id} = req.body;
        const edit = await checkFollowed(user_id, org_id);
        res.status(200).json(edit);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
router.delete('/unfollow', async (req: express.Request, res: express.Response) => {
    try {
        const {user_id, org_id} = req.body;
        await unfollow(user_id, org_id);
        res.status(204);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
router.delete('/deleteorganization', authenticateToken, requirePermission('delete_all_events'), async (req: express.Request, res: express.Response) => {
    try {
        const {name} = req.body;
        await deleteOrganization(name);
        res.status(204);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});
module.exports = router;