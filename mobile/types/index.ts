export type SharingDuration = '30' | '60' | 'until';

export type PrivacySettings = {
  shareLiveLocation: boolean;
  sharePreciseLocation: boolean;
  smsFallback: boolean;
  notifyAllContacts: boolean;
  locationUpdateIntervalSec: number;
  autoShareOnSos: boolean;
  showSharingStatus: boolean;
  sharingDuration: SharingDuration;
};

export const defaultPrivacy: PrivacySettings = {
  shareLiveLocation: true,
  sharePreciseLocation: true,
  smsFallback: true,
  notifyAllContacts: true,
  locationUpdateIntervalSec: 15,
  autoShareOnSos: false,
  showSharingStatus: false,
  sharingDuration: 'until',
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  preferredLanguage: 'en' | 'ta' | 'si';
  privacy: PrivacySettings;
  createdAt?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  notifyOnSos: boolean;
  preselectLocation: boolean;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

export type SosAlert = {
  id: string;
  status: 'active' | 'resolved' | 'cancelled';
  kind?: 'sos' | 'safety-check';
  shareToken: string;
  liveUrl: string;
  message?: string;
  smsConfigured?: boolean;
  lastLocation: Coordinates & { recordedAt: string };
  notifiedContacts: Array<{
    contactId: string;
    name: string;
    phone: string;
    channel: string;
    status: 'sent' | 'skipped' | 'failed';
    detail: string;
  }>;
  triggeredAt: string;
  resolvedAt: string | null;
  cancelledAt: string | null;
};

export type SafetyTip = {
  id: string;
  title: string;
  body: string;
  category: string;
};

export type EmergencyDirectory = {
  region: string;
  label: string;
  services: Array<{
    id: string;
    name: string;
    number: string;
    description: string;
  }>;
};
