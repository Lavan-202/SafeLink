import type { Contact } from '../types';
import { api } from './apiClient';

export type ContactInput = {
  name: string;
  phone: string;
  relationship?: string;
  isPrimary?: boolean;
  notifyOnSos?: boolean;
  preselectLocation?: boolean;
};

export function listContacts() {
  return api<Contact[]>('/contacts');
}

export function createContact(input: ContactInput) {
  return api<Contact>('/contacts', { method: 'POST', body: input });
}

export function updateContact(id: string, input: Partial<ContactInput>) {
  return api<Contact>(`/contacts/${id}`, { method: 'PATCH', body: input });
}

export function deleteContact(id: string) {
  return api<{ deleted: boolean }>(`/contacts/${id}`, { method: 'DELETE' });
}
