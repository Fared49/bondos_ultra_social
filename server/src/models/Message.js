import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    text: String,
    type: { type: String, enum: ['text', 'system', 'game', 'poll'], default: 'text' },
    data: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

messageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
