import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

router.post('/', authMiddleware, roomController.createRoom);
router.get('/', roomController.listRooms);
router.get('/:roomId', roomController.getRoom);
router.post('/:roomId/join', authMiddleware, roomController.joinRoom);
router.post('/:roomId/invite/:code', authMiddleware, roomController.joinByInvite);
router.get('/:roomId/messages', roomController.getRoomMessages);
router.post('/:roomId/post', authMiddleware, roomController.createPostInRoom);
router.post('/:roomId/game/start', authMiddleware, roomController.startGame);

export default router;
