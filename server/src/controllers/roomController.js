import Room from '../models/Room.js';
<<<<<<< HEAD
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
=======
import User from '../models/User.js';

export const createRoom = async (req, res) => {
  try {
    const { name, description, isPrivate, maxMembers, rules, tags } = req.body;
    const userId = req.user.id;

    const room = new Room({
      name,
      description,
      isPrivate,
      maxMembers,
      rules,
      tags,
      creator: userId,
      members: [userId],
      moderators: [userId],
    });

    await room.save();
    await room.populate('creator', 'username avatar');

    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = '-createdAt' } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ],
    };

    const rooms = await Room.find(query)
      .populate('creator', 'username avatar')
      .populate('members', 'username avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Room.countDocuments(query);

    res.json({
      rooms,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId)
      .populate('creator', 'username avatar')
      .populate('members', 'username avatar')
      .populate('moderators', 'username avatar');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.members.includes(userId)) {
      return res.status(400).json({ error: 'Already a member of this room' });
    }

    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({ error: 'Room is full' });
    }

    if (room.isPrivate) {
      room.joinRequests.push({ userId, status: 'pending' });
      await room.save();
      return res.json({ message: 'Join request sent' });
    }

    room.members.push(userId);
    room.activityLog.push({
      action: 'member_joined',
      userId,
      details: { memberCount: room.members.length },
    });

    await room.save();
    await room.populate('creator members', 'username avatar');

    res.json({ message: 'Joined room successfully', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    room.members = room.members.filter((id) => !id.equals(userId));
    room.moderators = room.moderators.filter((id) => !id.equals(userId));

    room.activityLog.push({
      action: 'member_left',
      userId,
      details: { memberCount: room.members.length },
    });

    await room.save();

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.moderators.includes(userId) && !room.creator.equals(userId)) {
      return res.status(403).json({ error: 'Not authorized to update room' });
    }

    Object.assign(room, updates);
    await room.save();

    res.json({ message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.creator.equals(userId)) {
      return res.status(403).json({ error: 'Only room creator can delete' });
    }

    await Room.findByIdAndDelete(roomId);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveMemberRequest = async (req, res) => {
  try {
    const { roomId, requestId } = req.params;
    const userId = req.user.id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.moderators.includes(userId) && !room.creator.equals(userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const request = room.joinRequests.find((r) => r._id.toString() === requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'approved';
    room.members.push(request.userId);
    await room.save();

    res.json({ message: 'Request approved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
>>>>>>> 9854696 (feat: Transform into comprehensive entertainment + social platform)
