import type { Coordinates, PrivacySettings, SosAlert } from '../types';
import { api } from './apiClient';

export function triggerSos(location: Coordinates) {
  return api<SosAlert>('/sos', { method: 'POST', body: location });
}

export function getActiveSos() {
  return api<SosAlert | null>('/sos/active');
}

export function getSos(id: string) {
  return api<SosAlert>(`/sos/${id}`);
}

export function updateSosLocation(id: string, location: Coordinates) {
  return api<SosAlert>(`/sos/${id}/location`, { method: 'POST', body: location });
}

export function resolveSos(id: string) {
  return api<SosAlert>(`/sos/${id}/resolve`, { method: 'POST', body: {} });
}

export function cancelSos(id: string) {
  return api<SosAlert>(`/sos/${id}/cancel`, { method: 'POST', body: {} });
}

export function getHistory() {
  return api<{ total: number; alerts: SosAlert[] }>('/history');
}

export function getPrivacy() {
  return api<PrivacySettings>('/privacy');
}

export function updatePrivacy(input: Partial<PrivacySettings>) {
  return api<PrivacySettings>('/privacy', { method: 'PATCH', body: input });
}
