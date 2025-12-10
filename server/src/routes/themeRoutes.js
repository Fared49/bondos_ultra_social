import express from 'express';
import {
  getAllThemes,
  createTheme,
  getUserTheme,
  setUserTheme,
} from '../controllers/themeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllThemes);
router.post('/', authenticateToken, createTheme);
router.get('/user/:userId', getUserTheme);
router.put('/user/:userId', authenticateToken, setUserTheme);

export default router;
