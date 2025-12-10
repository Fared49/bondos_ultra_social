<<<<<<< HEAD
import React from 'react';

export default function PostCard({ post, onLike, onComment }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">{post.title}</h3>
          <p className="text-sm text-gray-600">بواسطة {post.author?.username}</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
=======
import React, { useState } from 'react';
import { postsAPI } from '../services/api';

export default function PostCard({ post, onLike, onUnlike }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await onUnlike(post._id);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await onLike(post._id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
      {/* Author */}
      <div className="flex items-center mb-4">
        <img
          src={post.author.avatar || 'https://via.placeholder.com/40'}
          alt={post.author.username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold">{post.author.username}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>

      {/* Category */}
      <div className="mb-3">
        <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm">
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
          {post.category}
        </span>
      </div>

<<<<<<< HEAD
      <p className="text-gray-700 mb-4">{post.content}</p>

      <div className="flex gap-4 text-sm">
        <button
          onClick={() => onLike(post._id)}
          className="flex items-center gap-1 text-red-600 hover:text-red-700"
        >
          ❤️ {post.likes?.length || 0} إعجاب
        </button>
        <button
          onClick={() => onComment(post._id)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
        >
          💬 {post.comments?.length || 0} تعليق
        </button>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {post.tags?.map((tag, idx) => (
          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
=======
      {/* Content */}
      <p className="mb-4 text-gray-700 dark:text-gray-300">{post.content}</p>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {post.images.slice(0, 4).map((image, idx) => (
            <img key={idx} src={image} alt={`Post ${idx}`} className="w-full h-48 object-cover rounded" />
          ))}
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-sm text-gray-600 dark:text-gray-400">#{tag}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-3 py-1 rounded transition ${
            isLiked
              ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
              : 'hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
        >
          ❤️ {likesCount}
        </button>

        <button className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-1 rounded transition">
          💬 {post.comments.length}
        </button>

        <button className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-1 rounded transition">
          🔗 Share
        </button>
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
      </div>
    </div>
  );
}
