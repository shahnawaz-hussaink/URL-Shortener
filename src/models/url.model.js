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
    clicks: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customSlug: {
      type: String,
    },
    expireAt: {
      type: Date,
    },
    ipAddress : {
      type : String,
      required : true
    }
  },
  {
    timestamps: true,
  },
);

export const Url = mongoose.model('Url', urlSchema);
