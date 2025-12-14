import User from '../models/User.js';
import Room from '../models/Room.js';
import Community from '../models/Community.js';
import Report from '../models/Report.js';
import ModuleConfig from '../models/ModuleConfig.js';

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password -refreshToken')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, { isBanned: true }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User banned successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, { isBanned: false }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User unbanned successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const promoteUserToMod = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, { role: 'moderator' }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User promoted to moderator', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const promoteUserToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, { role: 'admin' }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User promoted to admin', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Room Management
export const getAllRooms = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const rooms = await Room.find()
      .populate('creator', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const total = await Room.countDocuments();

    res.json({
      rooms,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRoomAdmin = async (req, res) => {
  try {
    const { roomId } = req.params;

    await Room.findByIdAndDelete(roomId);

    res.json({ message: 'Room deleted by admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Community Management
export const getAllCommunities = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const communities = await Community.find()
      .populate('creator', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const total = await Community.countDocuments();

    res.json({
      communities,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCommunityAdmin = async (req, res) => {
  try {
    const { communityId } = req.params;

    await Community.findByIdAndDelete(communityId);

    res.json({ message: 'Community deleted by admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reports
export const getReports = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;

    const reports = await Report.find({ status })
      .populate('reportedBy', 'username')
      .populate('resolvedBy', 'username')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const total = await Report.countDocuments({ status });

    res.json({
      reports,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { adminNotes, action } = req.body;
    const adminId = req.user.id;

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status: 'resolved',
        adminNotes,
        action,
        resolvedBy: adminId,
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report resolved', report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Module Configuration
export const getModuleConfig = async (req, res) => {
  try {
    let config = await ModuleConfig.findOne({ platform: 'system' });

    if (!config) {
      config = new ModuleConfig({ platform: 'system' });
      await config.save();
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateModuleConfig = async (req, res) => {
  try {
    const { modules, features, theme } = req.body;

    let config = await ModuleConfig.findOne({ platform: 'system' });

    if (!config) {
      config = new ModuleConfig({ platform: 'system' });
    }

    if (modules) config.modules = { ...config.modules, ...modules };
    if (features) config.features = { ...config.features, ...features };
    if (theme) config.theme = theme;

    await config.save();

    res.json({ message: 'Module config updated', config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// System Stats
export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalCommunities = await Community.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    const stats = {
      totalUsers,
      totalRooms,
      totalCommunities,
      pendingReports,
      timestamp: new Date(),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
