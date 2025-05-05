import express from 'express';
import {createOrganization, deleteOrganization, featureOrganization, followOrganization, getCategory, getFeaturedOrganizations, getOrganizationById, getOrganizationByName, getOrganizations,getOrganizationsFollowed,getOrganizationsWithCategory, getOrganizationsWithCategoryId, removeFeature, unfollow, updateOrganization, updatePhoto, isFollowed } from '../models/organizations';
import { authenticateToken, requirePermission } from '../middleware/authMiddleware';
import { requireOwnershipOrPermission } from '../middleware/requireOwnershipOrPermission';

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
router.get('/category', authenticateToken, async(req: express.Request, res:express.Response) => {
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
router.post('/create', authenticateToken, requirePermission('edit_all_organizations'), async(req: express.Request, res: express.Response) => {
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
router.post('/follow', authenticateToken, async(req: express.Request, res: express.Response) => {
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
router.put('/update',
    authenticateToken,
    requireOwnershipOrPermission({
        fetchResource: getOrganizationById,
        permissionOwn: 'edit_org_posts',
        permissionAll: 'edit_all_posts',
        extractUserId: (org) => org.org_id,
        compareToUser: (user) => user.org_id,
        idSource: 'query',
        idKey: 'org_id',
      }),      
    async(req: express.Request, res: express.Response) => {
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
router.put('/setfeatured', requirePermission('edit_all_posts'), async(req: express.Request, res: express.Response) => {
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
router.put('/removefeatured', requirePermission('edit_all_posts'), async(req: express.Request, res: express.Response) => {
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
});
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

router.delete('/deleteorganization',
    requireOwnershipOrPermission({
    fetchResource: getOrganizationById,
    permissionOwn: 'delete_org_posts',
    permissionAll: 'delete_all_posts',
    extractUserId: (org) => org.org_id,
    compareToUser: (user) => user.org_id,
    idSource: 'query',
    idKey: 'org_id',
  }), async (req: express.Request, res: express.Response) => {
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

router.put('/updatephoto',
//     requireOwnershipOrPermission({
//     fetchResource: getOrganizationById,
//     permissionOwn: 'edit_org_posts',
//     permissionAll: 'edit_all_posts',
//     extractUserId: (org) => org.org_id,
//     compareToUser: (user) => user.org_id,
//     idSource: 'query',
//     idKey: 'org_id',
//   }),
  async(req: express.Request, res: express.Response) => {
    try{
        const {org_id, image_path} = req.body;
        const edit = await updatePhoto(org_id, image_path);
        res.status(200).json(edit);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})
router.get('/isfollowed/:user_id/:org_id', async (req: express.Request, res: express.Response) => {
    try{
        const result = await isFollowed(Number(req.params.user_id), Number(req.params.org_id));
        res.status(200).json(result);
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }  
});
module.exports = router;