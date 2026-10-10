import type { RequestHandler } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as usersService from './users.service';

export const getMe: RequestHandler = asyncHandler(async (req, res) => {
  const data = await usersService.getProfile(req.userId!);
  res.json({ data });
});

export const updateMe: RequestHandler = asyncHandler(async (req, res) => {
  const data = await usersService.updateProfile(req.userId!, req.body);
  res.json({ data });
});
