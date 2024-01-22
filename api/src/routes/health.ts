import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
const router = require('express').Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.send('Authenticated!');
});

router.get('/protected-route', authenticateToken, (req: express.Request, res: express.Response) => {
  res.send('Protected!');
});

router.get('/protected-route', authenticateToken, (req: express.Request, res: express.Response) => {
  res.send('Protected!');
});

module.exports = router;