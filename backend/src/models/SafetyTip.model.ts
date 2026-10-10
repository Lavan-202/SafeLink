import mongoose, { Schema } from 'mongoose';

const safetyTipSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    priority: { type: Number, default: 100 },
  },
  { timestamps: true },
);

export const SafetyTip = mongoose.model('SafetyTip', safetyTipSchema);
