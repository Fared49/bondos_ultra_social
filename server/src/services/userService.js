import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export async function createUser(data) {
  // Let the `User` model pre-save hook perform hashing to avoid double-hash
  return User.create(data);
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
