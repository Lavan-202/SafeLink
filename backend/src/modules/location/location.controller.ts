import type { RequestHandler } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getLiveShare } from './location.service';

export const live: RequestHandler = asyncHandler(async (req, res) => {
  const data = await getLiveShare(req.params.token);
  res.json({ data });
});
