import express from 'express';
<<<<<<< HEAD
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
=======
import { register, login, refreshAccessToken, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', authenticateToken, logout);
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)

export default router;
