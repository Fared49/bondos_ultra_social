import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema(
  {
    gameType: {
      type: String,
      enum: ['xo', 'cards', 'movie', 'word', 'describe', 'snakes', 'memory', 'quiz'],
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    players: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        username: String,
        score: { type: Number, default: 0 },
        isReady: { type: Boolean, default: false },
        position: Number,
      },
    ],
    gameState: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['waiting', 'playing', 'finished', 'abandoned'],
      default: 'waiting',
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    winnerName: String,
    startedAt: Date,
    endedAt: Date,
    maxPlayers: {
      type: Number,
      default: 2,
    },
    roundNumber: {
      type: Number,
      default: 1,
    },
    totalRounds: {
      type: Number,
      default: 1,
    },
    scoreBoard: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        username: String,
        finalScore: Number,
        rank: Number,
      },
    ],
  },
  { timestamps: true }
);

gameSessionSchema.index({ roomId: 1, createdAt: -1 });
gameSessionSchema.index({ gameType: 1 });

export default mongoose.model('GameSession', gameSessionSchema);
