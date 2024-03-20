import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from "../interfaces/User";
import { config } from "../config/config";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.accessTokenSecret, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user as User;
    next();
  });
};

// Usage example:
// router.get('/protected-route', authenticateToken, (req, res) => {
//   // Access req.user here
// });
