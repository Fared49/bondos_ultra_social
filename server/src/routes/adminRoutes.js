import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
  getAllUsers,
  banUser,
  unbanUser,
  promoteUserToMod,
  promoteUserToAdmin,
  getAllRooms,
  deleteRoomAdmin,
  getAllCommunities,
  deleteCommunityAdmin,
  getReports,
  resolveReport,
  getModuleConfig,
  updateModuleConfig,
  getSystemStats,
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

// User management
router.get('/users', getAllUsers);
router.post('/users/:userId/ban', banUser);
router.post('/users/:userId/unban', unbanUser);
router.post('/users/:userId/promote-mod', promoteUserToMod);
router.post('/users/:userId/promote-admin', promoteUserToAdmin);

// Room management
router.get('/rooms', getAllRooms);
router.delete('/rooms/:roomId', deleteRoomAdmin);

// Community management
router.get('/communities', getAllCommunities);
router.delete('/communities/:communityId', deleteCommunityAdmin);

// Reports
router.get('/reports', getReports);
router.put('/reports/:reportId/resolve', resolveReport);

// Module configuration
router.get('/modules', getModuleConfig);
router.put('/modules', updateModuleConfig);

// System stats
router.get('/stats', getSystemStats);

export default router;
