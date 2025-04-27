import {config} from '../config/config'
import express from 'express';
import {getUser, createUser, getUserByRefreshToken} from '../models/users';
import {hashPassword, comparePasswords} from '../utils/password';
import {createAccessToken, createRefreshToken} from '../utils/token';
import jwt from 'jsonwebtoken';

const pool = require('../db');
const router = require('express').Router();
const refreshTokenSecret:string = config.refreshTokenSecret!;

router.post('/login', async (req: express.Request, res: express.Response) => {
    try {
        const { email, phoneNumber, password } = req.body;

        if (!email && !password) {
            return res.status(400).json('Username and password are required');
        }

        const user = await getUser(email, phoneNumber);
        if (!user) {
            return res.status(404).json('User does not exist');
        }

        if (await comparePasswords(password, user.password_hash as string)) {
            const accessToken = await createAccessToken(user);
            const refreshToken = await createRefreshToken(user);
            const hashedRefreshToken = await hashPassword(refreshToken);

            await pool.query('UPDATE users SET last_login = NOW() WHERE user_id = $1', [user.user_id]);
            await pool.query('UPDATE users SET refresh_token = $1 WHERE user_id = $2', [hashedRefreshToken, user.user_id]);

            // Include role_id in the response
            res.status(200).json({
                accessToken,
                refreshToken,
                role_id: user.role_id, // Add role_id here
            });
        } else {
            res.status(401).json('Invalid password');
        }

    } catch (error) {
        const err = error as Error;
        res.status(500).json(`Internal server error: ${err.message}`);
    }
});


router.post('/logout', async (req: express.Request, res: express.Response) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json('User ID is required');
    }

    try {
        await pool.query('UPDATE users SET refresh_token = NULL WHERE user_id = $1', [userId]);

        res.status(200).json('Successfully logged out');
    } catch (error) {
        const err = error as Error;
        res.status(500).json(`Internal server error: ${err.message}`);
    }
});


router.post('/register', async (req: express.Request, res: express.Response) => {
    const { email, phoneNumber, password, firstName, lastName, dateOfBirth } = req.body;

    try {
        const existingUser = await getUser(email, phoneNumber);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await createUser(email, phoneNumber, hashedPassword, firstName, lastName, dateOfBirth);

        const refreshToken = await createRefreshToken(newUser);
        const hashedRefreshToken = await hashPassword(refreshToken);

        await pool.query('UPDATE users SET refresh_token = $1 WHERE user_id = $2', [hashedRefreshToken, newUser.user_id]);

        const accessToken = await createAccessToken(newUser);
        
        res.status(201).json({
            accessToken,
            refreshToken,
            role_id: newUser.role_id 
        });

    } catch (error) {
        res.status(500).json({ error: `${(error as Error).message}` });
    }
});



router.post('/refresh-access-token', async (req: express.Request, res: express.Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json('Refresh token is required');
    }

    try {
        jwt.verify(refreshToken, refreshTokenSecret);
        const decode = jwt.decode(refreshToken) as jwt.JwtPayload;
        const user = await getUserByRefreshToken(decode?.user_id);

        if (!user) {
            return res.status(403).json('Invalid user');
        }
        if (!user.refresh_token || !await comparePasswords(refreshToken, user.refresh_token)) {
            return res.status(403).json('Invalid refresh token');
        }

        const newAccessToken = await createAccessToken(user);
        res.status(201).json({ accessToken: newAccessToken });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json('Invalid refresh token');
        } else {
            res.status(500).json(`Internal server error: ${(error as Error).message}`);
        }
    }
});

router.post('/verify-access-token', async (req: express.Request, res: express.Response) => {
	const { accessToken } = req.body;
	if (!accessToken) {
		return res.status(401).json('Access token is required');
	}

	try {
		jwt.verify(accessToken, config.accessTokenSecret!);
		res.status(200).json('Valid access token');
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			res.status(403).json('Invalid access token');
		} else {
			res.status(500).json(`Internal server error: ${(error as Error).message}`);
		}
	}
});



module.exports = router;