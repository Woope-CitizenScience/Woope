import express from 'express';
const router = require('express').Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.send('OK');
});

module.exports = router;