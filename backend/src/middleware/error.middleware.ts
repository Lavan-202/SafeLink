import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';

export const notFoundMiddleware: RequestHandler = (_req, _res, next) => {
  next(new AppError('Route not found', 404));
};

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { message: err.message, ...err.details } });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: { message: err.message } });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: { message: 'Invalid id' } });
    return;
  }

  console.error(err);
  res.status(500).json({ error: { message: 'Something went wrong' } });
};
