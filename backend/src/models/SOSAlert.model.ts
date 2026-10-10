import mongoose, { Schema } from 'mongoose';

const locationSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, default: null },
    recordedAt: { type: Date, required: true },
  },
  { _id: false },
);

const notifiedContactSchema = new Schema(
  {
    contactId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    channel: { type: String, enum: ['sms'], default: 'sms' },
    status: { type: String, enum: ['sent', 'skipped', 'failed'], required: true },
    detail: { type: String, default: '' },
  },
  { _id: false },
);

const sosAlertSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['active', 'resolved', 'cancelled'], default: 'active', index: true },
    kind: { type: String, enum: ['sos', 'safety-check'], default: 'sos' },
    shareToken: { type: String, required: true, unique: true },
    lastLocation: { type: locationSchema, required: true },
    notifiedContacts: { type: [notifiedContactSchema], default: [] },
    triggeredAt: { type: Date, default: () => new Date() },
    resolvedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const SOSAlert = mongoose.model('SOSAlert', sosAlertSchema);
