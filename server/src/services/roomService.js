import Room from '../models/Room.js';
import Message from '../models/Message.js';
import { generateInviteCode } from '../utils/tokenUtils.js';

export async function createRoom(data) {
  const inviteCode = data.privacy === 'invite' ? generateInviteCode() : null;
  return Room.create({
    ...data,
    members: [data.owner],
    inviteCode,
  });
}

export async function getRoomById(roomId) {
  return Room.findById(roomId)
    .populate('owner', 'username avatar')
    .populate('members', 'username avatar isOnline');
}

export async function addMemberToRoom(roomId, userId) {
  const room = await Room.findById(roomId);
  if (!room.members.includes(userId)) {
    room.members.push(userId);
    await room.save();
  }
  return room;
}

export async function getRoomMessages(roomId, limit = 50, skip = 0) {
  return Message.find({ room: roomId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('sender', 'username avatar');
}

export async function saveMessage(sender, room, text, type = 'text', data = null) {
  return Message.create({ sender, room, text, type, data });
}

export async function findRoomByInviteCode(code) {
  return Room.findOne({ inviteCode: code });
}

export async function updateRoomModules(roomId, modules) {
  return Room.findByIdAndUpdate(roomId, { modules }, { new: true });
}
