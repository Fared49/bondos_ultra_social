import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  updateCommunity,
  getTrendingCommunities,
} from '../controllers/communityController.js';

const router = express.Router();

router.post('/', authMiddleware, createCommunity);
router.get('/', getCommunities);
router.get('/trending', getTrendingCommunities);
router.get('/:communityId', getCommunityById);
router.post('/:communityId/join', authMiddleware, joinCommunity);
router.post('/:communityId/leave', authMiddleware, leaveCommunity);
router.put('/:communityId', authMiddleware, updateCommunity);

export default router;
