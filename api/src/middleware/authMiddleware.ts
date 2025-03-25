import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, DecodedUserPayload } from "../interfaces/User";
import { config } from "../config/config";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedUserPayload;
    }
  }
}

export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.accessTokenSecret, (err, decoded) => {
    if (err) return res.sendStatus(401);
    req.user = decoded as DecodedUserPayload;
    next();
  });
};


export const requirePermission = (permission: string) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = req.user;

    if (!user || !user.permissions || !user.permissions[permission]) {
      return res.status(403).json({ error: "You do not have permission to perform this action." });
    }

    next(); // User has permission, move on
  };
};


// Usage example:
// router.get('/protected-route', authenticateToken, (req, res) => {
//   // Access req.user here
// });
