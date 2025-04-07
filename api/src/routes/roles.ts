import express from 'express';
import { createRole, createRolePermission, deleteRole, deleteRolePermission, getPermissions, getRolePermissions, getRoles } from '../models/roles';

const router = require('express').Router();

router.get('/roles', async (req: express.Request, res: express.Response) => {
    try {
        const roles = await getRoles();
        res.status(200).json(roles);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

router.get('/permissions', async (req: express.Request, res: express.Response) => {
    try {
        const roles = await getPermissions();
        res.status(200).json(roles);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

router.get('/role-permissions/:role_id', async (req: express.Request, res: express.Response) => {
    try {
        const data = await getRolePermissions(Number(req.params.role_id));
        res.status(200).json(data);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

router.delete('/delete/:role_id', async (req: express.Request, res: express.Response) => {
    try {
        await deleteRole(Number(req.params.role_id))
        res.status(200).json({ message: "Role deleted successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

router.get('/create/:name', async (req: express.Request, res: express.Response) => {
    try {
        const data = await createRole(req.params.name)
        res.status(200).json(data);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

router.post('/create-role-permission', async (req: express.Request, res: express.Response) => {
    try {
        await createRolePermission(req.body.role_id, req.body.permission_id)
        res.status(200).json("Role permission successfully created");
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

router.delete('/delete-role-permission', async (req: express.Request, res: express.Response) => {
    try {
        await deleteRolePermission(req.body.role_id, req.body.permission_id)
        res.status(200).json("Role permission successfully deleted");
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
})

module.exports = router;