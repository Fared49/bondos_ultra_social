import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as userService from '../services/userService.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/refresh', userController.refreshToken);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.post('/follow/:userId', authMiddleware, userController.followUser);
router.get('/search', userController.searchUsers);

export default router;
