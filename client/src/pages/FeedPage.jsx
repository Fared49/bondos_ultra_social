import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomsAPI } from '../services/api.js';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    roomsAPI.list().then(res => setPosts(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Feed</h1>
      <div className="grid gap-4">
        {posts.map(post => (
          <div key={post._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">{post.name}</h3>
            <p className="text-gray-600">{post.description}</p>
            <Link to={`/rooms/${post._id}`} className="text-primary mt-2 inline-block">View Room →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
