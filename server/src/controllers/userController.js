import User from '../models/User.js';
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
