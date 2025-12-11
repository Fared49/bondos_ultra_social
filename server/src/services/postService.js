import Post from '../models/Post.js';

export async function createPost(data) {
  return Post.create(data);
}

export async function getPostById(postId) {
  return Post.findById(postId)
    .populate('author', 'username avatar')
    .populate('comments.user', 'username avatar');
}

export async function getAllPosts(skip = 0, limit = 20) {
  return Post.find()
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

export async function getTrendingPosts(limit = 10) {
  return Post.find()
    .sort({ likes: -1, createdAt: -1 })
    .limit(limit)
    .populate('author', 'username avatar');
}

export async function updatePost(postId, data) {
  return Post.findByIdAndUpdate(postId, data, { new: true })
    .populate('author', 'username avatar');
}

export async function deletePost(postId) {
  return Post.findByIdAndDelete(postId);
}

export async function likePost(postId, userId) {
  const post = await Post.findById(postId);
  if (!post) return null;
  
  const hasLiked = post.likes.includes(userId);
  if (hasLiked) {
    post.likes = post.likes.filter(id => !id.equals(userId));
  } else {
    post.likes.push(userId);
  }
  await post.save();
  return post;
}

export async function addComment(postId, userId, text) {
  const post = await Post.findById(postId);
  if (!post) return null;
  
  post.comments.push({ user: userId, text, createdAt: new Date() });
  await post.save();
  return post.populate('comments.user', 'username avatar');
}

export async function deleteComment(postId, commentId) {
  const post = await Post.findById(postId);
  if (!post) return null;
  
  post.comments = post.comments.filter(c => !c._id.equals(commentId));
  await post.save();
  return post;
}

export async function searchPosts(query) {
  return Post.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } }
    ]
  })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 });
}
