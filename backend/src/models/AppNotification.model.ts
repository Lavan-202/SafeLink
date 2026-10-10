import mongoose, { Schema } from 'mongoose';

const appNotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sampleKey: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['location-view', 'sos-ended', 'battery'], required: true },
    occurredAt: { type: Date, required: true },
  },
  { timestamps: true },
);

appNotificationSchema.index({ userId: 1, sampleKey: 1 }, { unique: true });

export const AppNotification = mongoose.model('AppNotification', appNotificationSchema);
