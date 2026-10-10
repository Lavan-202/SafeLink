import mongoose, { Schema } from 'mongoose';

const locationShareSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sosAlertId: { type: Schema.Types.ObjectId, ref: 'SOSAlert', required: true, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, default: null },
    recordedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

export const LocationShare = mongoose.model('LocationShare', locationShareSchema);
