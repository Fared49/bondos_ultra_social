import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export async function createUser(data) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  return User.create({ ...data, password: hashedPassword });
}

export async function validatePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function getUserWithPassword(email) {
  return User.findOne({ email }).select('+password');
}

export async function getUserById(userId) {
  return User.findById(userId)
    .populate('followers', 'username avatar')
    .populate('following', 'username avatar');
}

export function sanitizeUser(user) {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.refreshToken;
  return obj;
}
