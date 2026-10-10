import type { RequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new AppError('Sign in required', 401));
    return;
  }

  try {
    const { userId } = verifyToken(header.slice('Bearer '.length));
    req.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
};
