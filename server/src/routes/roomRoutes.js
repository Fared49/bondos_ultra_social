import express from 'express';
<<<<<<< HEAD
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
=======
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createRoom,
  getRooms,
  getRoomById,
  joinRoom,
  leaveRoom,
  updateRoom,
  deleteRoom,
  approveMemberRequest,
} from '../controllers/roomController.js';

const router = express.Router();

router.post('/', authMiddleware, createRoom);
router.get('/', getRooms);
router.get('/:roomId', getRoomById);
router.post('/:roomId/join', authMiddleware, joinRoom);
router.post('/:roomId/leave', authMiddleware, leaveRoom);
router.put('/:roomId', authMiddleware, updateRoom);
router.delete('/:roomId', authMiddleware, deleteRoom);
router.post('/:roomId/approve-request/:requestId', authMiddleware, approveMemberRequest);
>>>>>>> 9854696 (feat: Transform into comprehensive entertainment + social platform)

export default router;
