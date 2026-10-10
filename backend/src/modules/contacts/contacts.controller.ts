import type { RequestHandler } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as contactsService from './contacts.service';

export const list: RequestHandler = asyncHandler(async (req, res) => {
  const data = await contactsService.listContacts(req.userId!);
  res.json({ data });
});

export const create: RequestHandler = asyncHandler(async (req, res) => {
  const data = await contactsService.createContact(req.userId!, req.body);
  res.status(201).json({ data });
});

export const update: RequestHandler = asyncHandler(async (req, res) => {
  const data = await contactsService.updateContact(req.userId!, req.params.id, req.body);
  res.json({ data });
});

export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const data = await contactsService.deleteContact(req.userId!, req.params.id);
  res.json({ data });
});
