import Community from '../models/Community.js';

export async function createCommunity(data) {
  return Community.create(data);
}

export async function getCommunityById(communityId) {
  return Community.findById(communityId)
    .populate('owner', 'username avatar')
    .populate('members', 'username avatar')
    .populate('moderators', 'username avatar');
}

export async function getAllCommunities(skip = 0, limit = 20) {
  return Community.find()
    .populate('owner', 'username avatar')
    .populate('members', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

export async function joinCommunity(communityId, userId) {
  const community = await Community.findById(communityId);
  if (!community) return null;
  
  if (!community.members.includes(userId)) {
    community.members.push(userId);
    await community.save();
  }
  return community;
}

export async function leaveCommunity(communityId, userId) {
  const community = await Community.findById(communityId);
  if (!community) return null;
  
  community.members = community.members.filter(id => !id.equals(userId));
  await community.save();
  return community;
}

export async function updateCommunity(communityId, data) {
  return Community.findByIdAndUpdate(communityId, data, { new: true })
    .populate('owner', 'username avatar')
    .populate('members', 'username avatar');
}

export async function deleteCommunity(communityId) {
  return Community.findByIdAndDelete(communityId);
}

export async function searchCommunities(query) {
  return Community.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  })
    .populate('owner', 'username avatar')
    .populate('members', 'username avatar');
}

export async function getCommunityMembers(communityId, skip = 0, limit = 20) {
  const community = await Community.findById(communityId)
    .populate({
      path: 'members',
      select: 'username avatar isOnline',
      options: { skip, limit }
    });
  return community.members;
}
