import Room from '../models/Room.js';
import Post from '../models/Post.js';
import Message from '../models/Message.js';
import * as roomService from '../services/roomService.js';
import { TicTacToeGame, SnakesAndLaddersGame, CardGame, GuessingGame } from '../games/GameManagers.js';

export async function createRoom(req, res) {
  try {
    const room = await roomService.createRoom({ ...req.body, owner: req.userId });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listRooms(req, res) {
  try {
    const rooms = await Room.find({ privacy: 'public' })
      .populate('owner', 'username avatar')
      .limit(20);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRoom(req, res) {
  try {
    const room = await roomService.getRoomById(req.params.roomId);
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function joinRoom(req, res) {
  try {
    const room = await roomService.addMemberToRoom(req.params.roomId, req.userId);
    res.json({ message: 'Joined', room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function joinByInvite(req, res) {
  try {
    const room = await roomService.findRoomByInviteCode(req.params.code);
    if (!room) return res.status(404).json({ error: 'Invalid invite' });
    await roomService.addMemberToRoom(room._id, req.userId);
    res.json({ message: 'Joined', room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRoomMessages(req, res) {
  try {
    const messages = await roomService.getRoomMessages(req.params.roomId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createPostInRoom(req, res) {
  try {
    const post = await Post.create({ ...req.body, author: req.userId, room: req.params.roomId });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function startGame(req, res) {
  try {
    const { gameType, players } = req.body;
    let gameState = {};

    switch (gameType) {
      case 'tictactoe':
        gameState = new TicTacToeGame(req.params.roomId, players).getState();
        break;
      case 'snakes':
        gameState = new SnakesAndLaddersGame(req.params.roomId, players).getState();
        break;
      case 'cards':
        gameState = new CardGame(req.params.roomId, players).getState();
        break;
      case 'guessing':
        gameState = new GuessingGame(req.params.roomId, players).getState();
        break;
    }

    res.json({ gameType, gameState });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
