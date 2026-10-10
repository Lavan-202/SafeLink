import type { RequestHandler } from 'express';
import { AppNotification } from '../../models/AppNotification.model';
import { asyncHandler } from '../../utils/asyncHandler';

export const list: RequestHandler = asyncHandler(async (req, res) => {
  const notes = await AppNotification.find({ userId: req.userId }).sort({ occurredAt: -1 }).limit(30);
  res.json({
    data: notes.map((note) => ({
      id: note.id,
      title: note.title,
      type: note.type,
      occurredAt: note.occurredAt,
    })),
  });
});
