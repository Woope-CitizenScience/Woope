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
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const user = await getUserByEmail(username);

        if (!user) {
            return res.status(404).send('User does not exist');
        }

        if (await comparePasswords(password, user.password)) {
            res.send(JSON.stringify(user));
        } else {
            res.status(401).send('Invalid password');
        }

    } catch (error) {
        const err = error as Error;
        res.status(500).send(`Internal server error: ${err.message}`);
    }
});


router.post('/register', async (req: express.Request, res: express.Response) => {
    try {
        const {username, password, firstName, lastName} = req.body;
        const user = await getUserByEmail(username);

        if (!user) {
            const hashedPassword = await hashPassword(password);
            const newUser = await createUser(username, hashedPassword, firstName, lastName);
            res.send(JSON.stringify(newUser));
        } else {
            res.status(400).send('User already exists');
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).send(err.message);
    }
});


module.exports = router;