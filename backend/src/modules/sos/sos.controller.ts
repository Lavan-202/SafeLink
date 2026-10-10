import type { RequestHandler } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as sosService from './sos.service';

export const create: RequestHandler = asyncHandler(async (req, res) => {
  const data = await sosService.createSos(req.userId!, req.body);
  res.status(201).json({ data });
});

export const active: RequestHandler = asyncHandler(async (req, res) => {
  const data = await sosService.getActiveSos(req.userId!);
  res.json({ data });
});

export const getOne: RequestHandler = asyncHandler(async (req, res) => {
  const data = await sosService.getSos(req.userId!, req.params.id);
  res.json({ data });
});

export const addLocation: RequestHandler = asyncHandler(async (req, res) => {
  const data = await sosService.addLocation(req.userId!, req.params.id, req.body);
  res.json({ data });
});

export const resolve: RequestHandler = asyncHandler(async (req, res) => {
  const data = await sosService.resolveSos(req.userId!, req.params.id);
  res.json({ data });
});

export const cancel: RequestHandler = asyncHandler(async (req, res) => {
  const data = await sosService.cancelSos(req.userId!, req.params.id);
  res.json({ data });
});
