import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    name: { type: String, required: true },
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    privacy: { type: String, enum: ['public', 'private', 'invite'], default: 'public' },
    modules: { chat: Boolean, posts: Boolean, games: Boolean, polls: Boolean },
    avatar: String,
    inviteCode: { type: String, unique: true, sparse: true },
    games: [
      {
        type: { type: String, enum: ['tictactoe', 'snakes', 'cards', 'guessing'] },
        state: mongoose.Schema.Types.Mixed,
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: Date,
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
=======
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    image: {
      type: String,
      default: null,
    },
    banner: {
      type: String,
      default: null,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
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
    maxMembers: {
      type: Number,
      default: 100,
    },
    rules: {
      type: String,
      default: 'Be respectful and follow community guidelines',
    },
    enabledModules: {
      games: { type: Boolean, default: true },
      chat: { type: Boolean, default: true },
      voice: { type: Boolean, default: false },
      mediaShare: { type: Boolean, default: true },
      polls: { type: Boolean, default: true },
    },
    activityLog: [
      {
        action: String,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        details: mongoose.Schema.Types.Mixed,
      },
    ],
    tags: [String],
    joinRequests: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
>>>>>>> 9854696 (feat: Transform into comprehensive entertainment + social platform)
  },
  { timestamps: true }
);

<<<<<<< HEAD
=======
roomSchema.index({ creator: 1, createdAt: -1 });
roomSchema.index({ name: 'text', description: 'text' });

>>>>>>> 9854696 (feat: Transform into comprehensive entertainment + social platform)
export default mongoose.model('Room', roomSchema);
