import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as postController from '../controllers/postController.js';

const router = express.Router();

router.post('/', authMiddleware, postController.createPost);
router.get('/', postController.listPosts);
router.get('/trending', postController.getTrendingPosts);
router.post('/:postId/like', authMiddleware, postController.likePost);
router.post('/:postId/comment', authMiddleware, postController.addComment);

export default router;
