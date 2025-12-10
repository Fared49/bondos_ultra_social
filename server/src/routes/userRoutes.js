import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  searchUsers,
} from '../controllers/userController.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/:id', optionalAuth, getUserProfile);
router.put('/:id', authenticateToken, updateUserProfile);
router.post('/:id/follow', authenticateToken, followUser);
router.post('/:id/unfollow', authenticateToken, unfollowUser);

export default router;
