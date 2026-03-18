import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    originalURL: {
      type: String,
      required: true,
    },
    shortURL: {
      type: String,
    },
    count: {
      type: Number,
      default : 0
    },
  },
  {
    timestamps: true,
  },
);

export const Url = mongoose.model('Url', urlSchema);
