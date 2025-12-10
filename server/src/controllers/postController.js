import Post from '../models/Post.js';

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
