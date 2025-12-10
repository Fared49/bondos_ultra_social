import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      required: true,
    },
    banner: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    category: {
      type: String,
      enum: ['Gaming', 'Arts', 'Music', 'Sports', 'Education', 'Technology', 'Entertainment', 'Other'],
      required: true,
    },
    tags: [String],
    rules: String,
    isPrivate: {
      type: Boolean,
      default: false,
    },
    totalMembers: {
      type: Number,
      default: 1,
    },
    totalPosts: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    joinRequests: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

communitySchema.index({ name: 'text', description: 'text', tags: 1 });
communitySchema.index({ category: 1, createdAt: -1 });

export default mongoose.model('Community', communitySchema);
