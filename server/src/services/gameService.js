import GameSession from '../models/GameSession.js';

export async function createGameSession(data) {
  return GameSession.create(data);
}

export async function getGameSessionById(sessionId) {
  return GameSession.findById(sessionId)
    .populate('players', 'username avatar')
    .populate('room', 'name');
}

export async function getActiveGameSessions(roomId) {
  return GameSession.find({
    room: roomId,
    status: { $in: ['active', 'paused'] }
  });
}

export async function updateGameState(sessionId, gameState) {
  return GameSession.findByIdAndUpdate(
    sessionId,
    { gameState, updatedAt: new Date() },
    { new: true }
  );
}

export async function endGameSession(sessionId, winner, scores) {
  return GameSession.findByIdAndUpdate(
    sessionId,
    {
      status: 'completed',
      winner,
      scores,
      endedAt: new Date()
    },
    { new: true }
  );
}

export async function getUserGameHistory(userId, limit = 20) {
  return GameSession.find({
    players: userId,
    status: 'completed'
  })
    .sort({ endedAt: -1 })
    .limit(limit)
    .populate('players', 'username avatar')
    .populate('room', 'name');
}

export async function getGameLeaderboard(gameType, limit = 10) {
  return GameSession.aggregate([
    { $match: { gameType, status: 'completed' } },
    { $group: {
        _id: '$winner',
        wins: { $sum: 1 },
        avgScore: { $avg: '$scores.total' }
      }
    },
    { $sort: { wins: -1 } },
    { $limit: limit },
    { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'playerInfo'
      }
    }
  ]);
}

export async function deleteGameSession(sessionId) {
  return GameSession.findByIdAndDelete(sessionId);
}
