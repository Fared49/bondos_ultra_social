import Post from '../models/Post.js';
<<<<<<< HEAD

export async function createPost(req, res) {
  try {
    const post = await Post.create({ ...req.body, author: req.userId });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTrendingPosts(req, res) {
  try {
    const posts = await Post.find()
      .sort({ 'likes': -1 })
      .limit(10);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function likePost(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post.likes.includes(req.userId)) {
      post.likes.push(req.userId);
      await post.save();
    }
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addComment(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    post.comments.push({ user: req.userId, text: req.body.text });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
=======
import User from '../models/User.js';

export const getAllPosts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    const filter = { isPublished: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = -1;

    const posts = await Post.find(filter)
      .populate('author', 'username avatar firstName lastName')
      .populate('comments.user', 'username avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;
    const userId = req.userId;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const post = new Post({
      author: userId,
      title,
      content,
      category,
      images,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    });

    await post.save();
    await post.populate('author', 'username avatar firstName lastName');

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('author', 'username avatar firstName lastName')
      .populate('comments.user', 'username avatar')
      .populate('likes', 'username avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, content, category, tags } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags.split(',').map(tag => tag.trim());

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    if (images.length > 0) {
      post.images = [...post.images, ...images];
    }

    await post.save();
    await post.populate('author', 'username avatar firstName lastName');

    res.json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Post.findByIdAndDelete(id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: 'Post liked',
      likes: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes = post.likes.filter(likeId => likeId.toString() !== userId);
    await post.save();

    res.json({
      message: 'Post unliked',
      likes: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: userId,
      text,
    });

    await post.save();
    await post.populate('comments.user', 'username avatar');

    res.status(201).json({
      message: 'Comment added',
      comments: post.comments,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: userId })
      .populate('author', 'username avatar firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments({ author: userId });

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
