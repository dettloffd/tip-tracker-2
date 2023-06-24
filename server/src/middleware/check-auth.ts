import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const jwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  // Allow options requests to proceed for CORS pre-flight 
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    // Check for the existence of Authorization header
    if (!req.headers.authorization) {
      throw new Error();
    }

    const authHeader = req.headers.authorization.split(' ');

    // Check if the Authorization header is correctly structured
    if (authHeader.length !== 2 || authHeader[0].toLowerCase() !== 'bearer') {
      throw new Error();
    }

    const token = authHeader[1];

    // Verify the token
    const decodedToken = jwt.verify(token, `${process.env.USER_TOKEN_KEY}`) as { userId?: string };

    // Check for the existence of userId
    if (!decodedToken.userId) {
      throw new Error();
    }

    // Pass the user data along
    req.body.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Authentication failed!',
    });
  }
};