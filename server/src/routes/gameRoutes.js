import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  startGameSession,
  getGameSession,
  updateGameState,
  finishGameSession,
  getGameSessions,
} from '../controllers/gameController.js';

const router = express.Router();

router.post('/session', authMiddleware, startGameSession);
router.get('/session/:sessionId', getGameSession);
router.put('/session/:sessionId/state', authMiddleware, updateGameState);
router.put('/session/:sessionId/finish', authMiddleware, finishGameSession);
router.get('/', getGameSessions);

export default router;
