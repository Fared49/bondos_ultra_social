import GameSession from '../models/GameSession.js';
import Room from '../models/Room.js';

export const startGameSession = async (req, res) => {
  try {
    const { roomId, gameType, players } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const gameSession = new GameSession({
      roomId,
      gameType,
      players: players.map((p) => ({
        userId: p.userId,
        username: p.username,
        score: 0,
        isReady: false,
        position: players.indexOf(p),
      })),
      maxPlayers: players.length,
      status: 'waiting',
    });

    await gameSession.save();

    res.status(201).json({
      message: 'Game session created',
      gameSession,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGameSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const gameSession = await GameSession.findById(sessionId).populate('players.userId', 'username avatar');

    if (!gameSession) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    res.json(gameSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateGameState = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { gameState, playerScores } = req.body;

    const gameSession = await GameSession.findById(sessionId);
    if (!gameSession) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    if (gameState) {
      gameSession.gameState = gameState;
    }

    if (playerScores) {
      gameSession.players.forEach((player) => {
        const scoreUpdate = playerScores.find((s) => s.userId === player.userId.toString());
        if (scoreUpdate) {
          player.score = scoreUpdate.score;
        }
      });
    }

    await gameSession.save();

    res.json({ message: 'Game state updated', gameSession });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const finishGameSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { winner, scoreBoard } = req.body;

    const gameSession = await GameSession.findById(sessionId);
    if (!gameSession) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    gameSession.status = 'finished';
    gameSession.endedAt = new Date();
    gameSession.winner = winner;
    gameSession.scoreBoard = scoreBoard;

    await gameSession.save();

    res.json({ message: 'Game finished', gameSession });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGameSessions = async (req, res) => {
  try {
    const { roomId, gameType, page = 1, limit = 10 } = req.query;

    const query = {};
    if (roomId) query.roomId = roomId;
    if (gameType) query.gameType = gameType;

    const sessions = await GameSession.find(query)
      .populate('players.userId', 'username avatar')
      .populate('winner', 'username avatar')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GameSession.countDocuments(query);

    res.json({
      sessions,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
