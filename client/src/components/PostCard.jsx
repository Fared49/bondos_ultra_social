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
          {post.category}
        </span>
      </div>

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
      </div>
    </div>
  );
}
