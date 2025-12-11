import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);


roomSchema.index({ creator: 1, createdAt: -1 });
roomSchema.index({ name: 'text', description: 'text' });


export default mongoose.model('Room', roomSchema);
