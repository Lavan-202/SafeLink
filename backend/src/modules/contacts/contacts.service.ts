import mongoose from 'mongoose';
import { EmergencyContact } from '../../models/EmergencyContact.model';
import { AppError } from '../../utils/AppError';

const CONTACT_LIMIT = 10;

export type ContactInput = {
  name: string;
  phone: string;
  relationship?: string;
  isPrimary?: boolean;
  notifyOnSos?: boolean;
  preselectLocation?: boolean;
};

function toContact(contact: {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  relationship?: string;
  isPrimary: boolean;
  notifyOnSos: boolean;
  preselectLocation?: boolean;
}) {
  return {
    id: contact._id.toString(),
    name: contact.name,
    phone: contact.phone,
    relationship: contact.relationship ?? '',
    isPrimary: contact.isPrimary,
    notifyOnSos: contact.notifyOnSos,
    preselectLocation: contact.preselectLocation ?? false,
  };
}

async function clearOtherPrimary(userId: string, keepId?: string) {
  await EmergencyContact.updateMany(
    { userId, ...(keepId ? { _id: { $ne: keepId } } : {}) },
    { isPrimary: false },
  );
}

export async function listContacts(userId: string) {
  const contacts = await EmergencyContact.find({ userId }).sort({ isPrimary: -1, name: 1 });
  return contacts.map(toContact);
}

export async function createContact(userId: string, input: ContactInput) {
  const count = await EmergencyContact.countDocuments({ userId });
  if (count >= CONTACT_LIMIT) {
    throw new AppError(`You can save up to ${CONTACT_LIMIT} trusted contacts`, 400);
  }

  const normalizedPhone = input.phone.replace(/\s+/g, ' ').trim();
  if (input.isPrimary) {
    await clearOtherPrimary(userId);
  }

  try {
    const contact = await EmergencyContact.create({
      userId,
      name: input.name,
      phone: normalizedPhone,
      relationship: input.relationship ?? '',
      isPrimary: input.isPrimary ?? false,
      notifyOnSos: input.notifyOnSos ?? true,
      preselectLocation: input.preselectLocation ?? false,
    });
    return toContact(contact);
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      throw new AppError('That phone number is already saved', 409);
    }
    throw error;
  }
}

export async function updateContact(userId: string, contactId: string, input: Partial<ContactInput>) {
  const contact = await EmergencyContact.findOne({ _id: contactId, userId });
  if (!contact) throw new AppError('Contact not found', 404);

  if (input.name !== undefined) contact.name = input.name;
  if (input.phone !== undefined) contact.phone = input.phone.replace(/\s+/g, ' ').trim();
  if (input.relationship !== undefined) contact.relationship = input.relationship;
  if (input.notifyOnSos !== undefined) contact.notifyOnSos = input.notifyOnSos;
  if (input.preselectLocation !== undefined) contact.preselectLocation = input.preselectLocation;
  if (input.isPrimary === true) {
    await clearOtherPrimary(userId, contact.id);
    contact.isPrimary = true;
  } else if (input.isPrimary === false) {
    contact.isPrimary = false;
  }

  try {
    await contact.save();
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      throw new AppError('That phone number is already saved', 409);
    }
    throw error;
  }

  return toContact(contact);
}

export async function deleteContact(userId: string, contactId: string) {
  const result = await EmergencyContact.deleteOne({ _id: contactId, userId });
  if (result.deletedCount === 0) throw new AppError('Contact not found', 404);
  return { deleted: true };
}
