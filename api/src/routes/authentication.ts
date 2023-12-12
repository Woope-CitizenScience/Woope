import {config} from '../config/config'
import express from 'express';
import { getUserByEmail, createUser } from '../models/users';
import {hashPassword, comparePasswords} from '../utils/password';
const router = require('express').Router();

const accessTokenSecret:string = config.accessTokenSecret!;
const refreshTokenSecret:string = config.refreshTokenSecret!;
const accessTokenLife:string = config.accessTokenLife!;
const refreshTokenLife:string = config.refreshTokenLife!;

router.post('/login', async (req: express.Request, res: express.Response) => {
    try {
        const {username, password} = req.body;
        const user = await getUserByEmail(username);
        if (user && await comparePasswords(password, user.password)) {
            res.send(JSON.stringify(user));
        } else {
            res.send('User does not exist');
        }

    } catch (error) {
        throw error;
    }


})

router.post('/register', async (req: express.Request, res: express.Response) => {
    try {
        const {username, password, firstName, lastName} = req.body;
        const user = await getUserByEmail(username);

        if (!user) {
            const hashedPassword = hashPassword(password);
            const newUser = await createUser(username, await hashedPassword, firstName, lastName);
            res.send(JSON.stringify(newUser));
        }
    } catch (error) {
        throw error;
    }
});

module.exports = router;