import express from 'express';
<<<<<<< HEAD
import { authMiddleware } from '../middleware/auth.js';
import * as postController from '../controllers/postController.js';

const router = express.Router();

router.post('/', authMiddleware, postController.createPost);
router.get('/', postController.listPosts);
router.get('/trending', postController.getTrendingPosts);
router.post('/:postId/like', authMiddleware, postController.likePost);
router.post('/:postId/comment', authMiddleware, postController.addComment);
=======
import {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getUserPosts,
} from '../controllers/postController.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getAllPosts);
router.post('/', authenticateToken, upload.array('images', 5), createPost);
router.get('/:id', optionalAuth, getPostById);
router.put('/:id', authenticateToken, upload.array('images', 5), updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.post('/:id/like', authenticateToken, likePost);
router.post('/:id/unlike', authenticateToken, unlikePost);
router.post('/:id/comments', authenticateToken, addComment);
router.get('/user/:userId', optionalAuth, getUserPosts);
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)

export default router;
