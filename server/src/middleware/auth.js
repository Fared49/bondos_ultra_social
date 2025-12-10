import { verifyToken } from '../utils/tokenUtils.js';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(403).json({ error: 'Invalid token' });

  req.userId = decoded.userId;
  next();
};

export const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token'));

  const decoded = verifyToken(token);
  if (!decoded) return next(new Error('Invalid token'));

  socket.userId = decoded.userId;
  next();
};
