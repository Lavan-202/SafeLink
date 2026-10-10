import { isSmsConfigured } from '../config/env';
import { EmergencyContact } from '../models/EmergencyContact.model';
import { sendSms } from './sms.service';

type NotifyInput = {
  userId: string;
  notifyAllContacts: boolean;
  message: string;
};

export async function notifyTrustedContacts(input: NotifyInput) {
  const filter: Record<string, unknown> = { userId: input.userId };
  if (!input.notifyAllContacts) {
    filter.notifyOnSos = true;
  }

  const contacts = await EmergencyContact.find(filter).sort({ isPrimary: -1, name: 1 });
  const smsConfigured = isSmsConfigured();

  const notifiedContacts = [];
  for (const contact of contacts) {
    const result = await sendSms(contact.phone, input.message);
    notifiedContacts.push({
      contactId: contact._id,
      name: contact.name,
      phone: contact.phone,
      channel: 'sms' as const,
      status: result.status,
      detail: result.detail,
    });
  }

  return { smsConfigured, notifiedContacts };
}
