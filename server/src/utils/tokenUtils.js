import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not defined');
  return jwt.sign({ userId }, secret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
};

export const generateRefreshToken = (userId) => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
  return jwt.sign({ userId }, secret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' });
};

export const generateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
};

export const verifyToken = (token, type = 'access') => {
  const secret = type === 'access' 
    ? (process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET)
    : (process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET);
  
  if (!secret) return null;
  
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

export const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};
