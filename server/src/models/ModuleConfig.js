import mongoose from 'mongoose';

const moduleConfigSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ['system', 'user'],
      default: 'system',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    modules: {
      games: { type: Boolean, default: true },
      rooms: { type: Boolean, default: true },
      communities: { type: Boolean, default: true },
      dashboard: { type: Boolean, default: true },
      presentationMode: { type: Boolean, default: true },
      adminPanel: { type: Boolean, default: false },
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'neon', 'cyber'],
      default: 'light',
    },
    features: {
      infiniteScroll: { type: Boolean, default: true },
      realtimeNotifications: { type: Boolean, default: true },
      voiceChat: { type: Boolean, default: false },
      videoChat: { type: Boolean, default: false },
      liveStreaming: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model('ModuleConfig', moduleConfigSchema);
