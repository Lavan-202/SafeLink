import mongoose, { Schema } from 'mongoose';

const supportMessageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

export const SupportMessage = mongoose.model('SupportMessage', supportMessageSchema);
