import {config} from '../config/config'
import express from 'express';
import { getUser, createUser } from '../models/users';
import {hashPassword, comparePasswords} from '../utils/password';
const pool = require('../db');
const router = require('express').Router();

const accessTokenSecret:string = config.accessTokenSecret!;
const refreshTokenSecret:string = config.refreshTokenSecret!;
const accessTokenLife:string = config.accessTokenLife!;
const refreshTokenLife:string = config.refreshTokenLife!;

router.post('/login', async (req: express.Request, res: express.Response) => {
    try {
        const { email, phoneNumber, password } = req.body;

        if (!email && !password) {
            return res.status(400).send('Username and password are required');
        }

        const user = await getUser(email, phoneNumber);
        if (!user) {
            return res.status(404).send('User does not exist');
        }

        if (await comparePasswords(password, user.password_hash)) {
			await pool.query('UPDATE users SET last_login = NOW() WHERE user_id = $1', [user.user_id]);
            res.status(200).send('Logged in');
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
        const {email, phoneNumber, password, firstName, lastName} = req.body;
        const user = await getUser(email, phoneNumber);


        if (!user) {
            const hashedPassword = await hashPassword(password);
            const newUser = await createUser(email, phoneNumber, hashedPassword, firstName, lastName);
            res.status(201).send(JSON.stringify(newUser));
        } else {
            res.status(400).send('User already exists');
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).send(err.message);
    }
});


module.exports = router;