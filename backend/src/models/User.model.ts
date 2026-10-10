import mongoose, { Schema } from 'mongoose';

const privacySchema = new Schema(
  {
    shareLiveLocation: { type: Boolean, default: true },
    sharePreciseLocation: { type: Boolean, default: true },
    smsFallback: { type: Boolean, default: true },
    notifyAllContacts: { type: Boolean, default: true },
    locationUpdateIntervalSec: { type: Number, default: 15, min: 5, max: 120 },
    autoShareOnSos: { type: Boolean, default: false },
    showSharingStatus: { type: Boolean, default: false },
    sharingDuration: { type: String, enum: ['30', '60', 'until'], default: 'until' },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, trim: true, default: 'University Student' },
    preferredLanguage: { type: String, enum: ['en', 'ta', 'si'], default: 'en' },
    passwordHash: { type: String, required: true, select: false },
    resetTokenHash: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
    privacy: { type: privacySchema, default: () => ({}) },
  },
  { timestamps: true },
);

export type PrivacySettings = {
  shareLiveLocation: boolean;
  sharePreciseLocation: boolean;
  smsFallback: boolean;
  notifyAllContacts: boolean;
  locationUpdateIntervalSec: number;
  autoShareOnSos: boolean;
  showSharingStatus: boolean;
  sharingDuration: '30' | '60' | 'until';
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  preferredLanguage: 'en' | 'ta' | 'si';
  privacy: PrivacySettings;
  createdAt?: Date;
};

type UserLike = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  role?: string;
  preferredLanguage?: string;
  privacy?: Partial<PrivacySettings> | null;
  createdAt?: Date;
};

export function defaultPrivacy(): PrivacySettings {
  return {
    shareLiveLocation: true,
    sharePreciseLocation: true,
    smsFallback: true,
    notifyAllContacts: true,
    locationUpdateIntervalSec: 15,
    autoShareOnSos: false,
    showSharingStatus: false,
    sharingDuration: 'until',
  };
}

export function toPublicUser(user: UserLike): PublicUser {
  const stored = user.privacy as { toObject?: () => Partial<PrivacySettings> } | Partial<PrivacySettings> | null | undefined;
  const privacy = stored && typeof (stored as { toObject?: () => Partial<PrivacySettings> }).toObject === 'function'
    ? (stored as { toObject: () => Partial<PrivacySettings> }).toObject()
    : (stored ?? {});

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role || 'University Student',
    preferredLanguage: user.preferredLanguage === 'ta' || user.preferredLanguage === 'si' ? user.preferredLanguage : 'en',
    privacy: { ...defaultPrivacy(), ...privacy },
    createdAt: user.createdAt,
  };
}

export const User = mongoose.model('User', userSchema);
