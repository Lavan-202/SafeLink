import type { RequestHandler } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as authService from './auth.service';

export const register: RequestHandler = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json({ data });
});

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body.email, req.body.password);
  res.json({ data });
});

export const forgotPassword: RequestHandler = asyncHandler(async (req, res) => {
  const data = await authService.forgotPassword(req.body.email);
  res.json({ data });
});

export const resetPassword: RequestHandler = asyncHandler(async (req, res) => {
  const data = await authService.resetPassword(req.body.email, req.body.token, req.body.password);
  res.json({ data });
});

export const me: RequestHandler = asyncHandler(async (req, res) => {
  const data = await authService.getMe(req.userId!);
  res.json({ data });
});
