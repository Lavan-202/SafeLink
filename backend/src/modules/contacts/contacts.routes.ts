import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as contactsController from './contacts.controller';
import { contactIdSchema, createContactSchema, updateContactSchema } from './contacts.validation';

export const contactsRouter = Router();

contactsRouter.use(requireAuth);
contactsRouter.get('/', contactsController.list);
contactsRouter.post('/', validate(createContactSchema), contactsController.create);
contactsRouter.patch('/:id', validate(updateContactSchema), contactsController.update);
contactsRouter.delete('/:id', validate(contactIdSchema), contactsController.remove);
