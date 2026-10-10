import type { RequestHandler } from 'express';
import { User, defaultPrivacy, toPublicUser } from '../../models/User.model';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';

export const get: RequestHandler = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('Account not found', 404);
  res.json({ data: toPublicUser(user).privacy });
});

export const update: RequestHandler = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('Account not found', 404);

  const stored = user.privacy as { toObject?: () => Record<string, unknown> } | undefined;
  const current = typeof stored?.toObject === 'function' ? stored.toObject() : (user.privacy ?? {});
  user.set('privacy', { ...defaultPrivacy(), ...current, ...req.body });
  user.markModified('privacy');
  await user.save();
  res.json({ data: toPublicUser(user).privacy });
});
