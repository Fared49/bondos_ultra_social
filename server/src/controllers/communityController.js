import Community from '../models/Community.js';

export const createCommunity = async (req, res) => {
  try {
    const { name, description, category, tags, rules, isPrivate } = req.body;
    const userId = req.user.id;

    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ error: 'Community name already exists' });
    }

    const community = new Community({
      name,
      description,
      category,
      tags,
      rules,
      isPrivate,
      creator: userId,
      members: [userId],
      moderators: [userId],
      totalMembers: 1,
    });

    await community.save();
    await community.populate('creator', 'username avatar');

    res.status(201).json({ message: 'Community created successfully', community });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommunities = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '', category = '', sort = '-createdAt' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const communities = await Community.find(query)
      .populate('creator', 'username avatar')
      .populate('members', 'username avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Community.countDocuments(query);

    res.json({
      communities,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommunityById = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId)
      .populate('creator', 'username avatar')
      .populate('members', 'username avatar')
      .populate('moderators', 'username avatar');

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    community.totalViews += 1;
    await community.save();

    res.json(community);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.user.id;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (community.members.includes(userId)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    if (community.isPrivate) {
      community.joinRequests.push({ userId });
      await community.save();
      return res.json({ message: 'Join request sent' });
    }

    community.members.push(userId);
    community.totalMembers += 1;
    await community.save();
    await community.populate('creator members', 'username avatar');

    res.json({ message: 'Joined community successfully', community });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const leaveCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.user.id;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    community.members = community.members.filter((id) => !id.equals(userId));
    community.moderators = community.moderators.filter((id) => !id.equals(userId));
    community.totalMembers = community.members.length;

    await community.save();

    res.json({ message: 'Left community successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (!community.moderators.includes(userId) && !community.creator.equals(userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(community, updates);
    await community.save();

    res.json({ message: 'Community updated successfully', community });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTrendingCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('creator', 'username avatar')
      .sort('-totalMembers -totalViews')
      .limit(10);

    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
