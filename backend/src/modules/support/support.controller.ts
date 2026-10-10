import type { RequestHandler } from 'express';
import { SupportMessage } from '../../models/SupportMessage.model';
import { asyncHandler } from '../../utils/asyncHandler';

export const create: RequestHandler = asyncHandler(async (req, res) => {
  await SupportMessage.create({ userId: req.userId, message: req.body.message });
  res.status(201).json({ data: { received: true } });
});
