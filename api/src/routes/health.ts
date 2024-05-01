import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
const router = require('express').Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.send('OK');
});

router.get('/protected-route', authenticateToken, (req: express.Request, res: express.Response) => {
  res.send('Protected!');
});

module.exports = router;