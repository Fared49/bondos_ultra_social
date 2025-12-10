import jwt from 'jsonwebtoken';

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const verifyToken = (token, type = 'access') => {
  const secret = type === 'access' ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

export const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};
