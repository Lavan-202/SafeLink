import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { AppError } from '../utils/AppError';

export const validate =
  (schema: ZodTypeAny): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!parsed.success) {
      const message = parsed.error.issues.map((issue) => issue.message).join(' ');
      next(new AppError(message || 'Invalid request', 400));
      return;
    }

    if (parsed.data.body) {
      req.body = parsed.data.body;
    }

    next();
  };
