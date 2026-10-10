import type { RequestHandler } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { listHistory } from '../sos/sos.service';

export const list: RequestHandler = asyncHandler(async (req, res) => {
  const alerts = await listHistory(req.userId!);
  res.json({
    data: {
      total: alerts.length,
      alerts,
    },
  });
});
