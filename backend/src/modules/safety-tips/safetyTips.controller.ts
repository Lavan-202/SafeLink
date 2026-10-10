import type { RequestHandler } from 'express';
import { SafetyTip } from '../../models/SafetyTip.model';
import { asyncHandler } from '../../utils/asyncHandler';

export const list: RequestHandler = asyncHandler(async (_req, res) => {
  const tips = await SafetyTip.find().sort({ priority: 1, title: 1 });
  res.json({
    data: tips.map((tip) => ({
      id: tip.id,
      title: tip.title,
      body: tip.body,
      category: tip.category,
    })),
  });
});
