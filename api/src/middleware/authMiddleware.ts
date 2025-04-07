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

/**
 * Middleware to authenticate a JWT token in the request header.
 * 
 * This function checks for the presence of a JWT token in the `Authorization` header of the request.
 * If the token is valid, it attaches the decoded user information to the `req.user` property and calls the next middleware.
 * If the token is missing or invalid, it responds with a `401 Unauthorized` status.
 * 
 * @example 
 * 
 * router.get('/protected-route', authenticateToken, (req, res) => {
      // Access req.user here
  });
 * 
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The Express next function to pass control to the next middleware.
 * @returns {void} - This function does not return a value directly but sends a response if the token is invalid.
 */

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
// router.get('/protected-route', authenticateToken, requirePermission('permission_name'), (req, res) => {
//   // Access req.user here
// });

