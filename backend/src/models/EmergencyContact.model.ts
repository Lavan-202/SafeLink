import mongoose, { Schema } from 'mongoose';

const emergencyContactSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relationship: { type: String, trim: true, default: '' },
    isPrimary: { type: Boolean, default: false },
    notifyOnSos: { type: Boolean, default: true },
    preselectLocation: { type: Boolean, default: false },
  },
  { timestamps: true },
);

emergencyContactSchema.index({ userId: 1, phone: 1 }, { unique: true });

export const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);
