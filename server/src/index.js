import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import postRoutes from './routes/postRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { socketAuthMiddleware } from './middleware/auth.js';
import * as roomService from './services/roomService.js';
import { TicTacToeGame, SnakesAndLaddersGame, CardGame, GuessingGame } from './games/GameManagers.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Socket.io events
io.use(socketAuthMiddleware);

const activeUsers = new Map(); // userId -> socketId
const gameInstances = new Map(); // roomId -> game

io.on('connection', (socket) => {
  import('./utils/logger.js').then(({ log }) => log(`✓ User ${socket.userId} connected`));
  activeUsers.set(socket.userId, socket.id);
  io.emit('users:online', Array.from(activeUsers.keys()));

  // Room events
  socket.on('room:join', async (roomId) => {
    socket.join(roomId);
    const room = await roomService.getRoomById(roomId);
    io.to(roomId).emit('room:memberJoined', { user: socket.userId, members: room.members });
  });

  socket.on('room:leave', (roomId) => {
    socket.leave(roomId);
    io.to(roomId).emit('room:memberLeft', { user: socket.userId });
  });

  // Chat events
  socket.on('chat:message', async (roomId, text) => {
    const msg = await roomService.saveMessage(socket.userId, roomId, text);
    io.to(roomId).emit('chat:message', msg);
  });

  // Presence
  socket.on('presence:typing', (roomId) => {
    io.to(roomId).emit('presence:typing', socket.userId);
  });

  socket.on('presence:stop', (roomId) => {
    io.to(roomId).emit('presence:stop', socket.userId);
  });

  // Game events
  socket.on('game:start', (roomId, gameType, players) => {
    let GameClass;
    switch (gameType) {
      case 'tictactoe':
        gameInstances.set(roomId, new TicTacToeGame(roomId, players));
        break;
      case 'snakes':
        gameInstances.set(roomId, new SnakesAndLaddersGame(roomId, players));
        break;
      case 'cards':
        gameInstances.set(roomId, new CardGame(roomId, players));
        break;
      case 'guessing':
        gameInstances.set(roomId, new GuessingGame(roomId, players));
        break;
    }
    const gameState = gameInstances.get(roomId);
    if (gameState) {
      io.to(roomId).emit('game:started', gameState.getState());
    }
  });

  socket.on('game:move', (roomId, move) => {
    const game = gameInstances.get(roomId);
    if (game) {
      const result = game.makeMove ? game.makeMove(socket.userId, move) : null;
      io.to(roomId).emit('game:state', game.getState());
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    activeUsers.delete(socket.userId);
    io.emit('users:online', Array.from(activeUsers.keys()));
    import('./utils/logger.js').then(({ log }) => log(`✗ User ${socket.userId} disconnected`));
  });
});

// Database connection
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bondos', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    import('./utils/logger.js').then(({ log }) => log('✓ MongoDB connected'));

    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      import('./utils/logger.js').then(({ log }) => log(`✓ Server running on port ${PORT}`));
    });
  } catch (err) {
    console.error('✗ Startup failed:', err);
    process.exit(1);
  }
}

start();

export { app, io };
