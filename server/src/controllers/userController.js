import User from '../models/User.js';
<<<<<<< HEAD
import { generateTokens, verifyToken } from '../utils/tokenUtils.js';
import * as userService from '../services/userService.js';

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ error: 'User exists' });

    const user = await userService.createUser({ username, email, password });
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({ user: userService.sanitizeUser(user), accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserWithPassword(email);
    if (!user || !(await userService.validatePassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ user: userService.sanitizeUser(user), accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    const decoded = verifyToken(refreshToken, 'refresh');
    if (!decoded) return res.status(403).json({ error: 'Invalid token' });

    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (user.refreshToken !== refreshToken) return res.status(403).json({ error: 'Token mismatch' });

    const tokens = generateTokens(decoded.userId);
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await userService.getUserById(req.userId);
    res.json(userService.sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    res.json(userService.sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function followUser(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user.following.includes(req.params.userId)) {
      user.following.push(req.params.userId);
      await user.save();
    }
    res.json({ message: 'Followed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function searchUsers(req, res) {
  try {
    const { q } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    }).limit(10);
    res.json(users.map(userService.sanitizeUser));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
=======

export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Check authorization
    if (userId !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { firstName, lastName, bio, avatar, theme } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
        ...(theme && { theme }),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (userId === id) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const user = await User.findById(userId);
    const userToFollow = await User.findById(id);

    if (!user || !userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.following.includes(id)) {
      user.following.push(id);
      userToFollow.followers.push(userId);
    }

    await user.save();
    await userToFollow.save();

    res.json({
      message: 'User followed successfully',
      following: user.following.length,
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(id);

    if (!user || !userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.following = user.following.filter(followId => followId.toString() !== id);
    userToUnfollow.followers = userToUnfollow.followers.filter(followerId => followerId.toString() !== userId);

    await user.save();
    await userToUnfollow.save();

    res.json({
      message: 'User unfollowed successfully',
      following: user.following.length,
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
      ],
    })
      .limit(20)
      .select('_id username firstName lastName avatar');

    res.json(users);
  } catch (error) {
    next(error);
  }
};
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
