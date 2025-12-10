import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
  });

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.getAllPosts({
        category: filters.category,
        search: filters.search,
        page: filters.page,
      });
      setPosts(response.data.posts);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postsAPI.likePost(postId);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await postsAPI.unlikePost(postId);
    } catch (err) {
      console.error('Error unliking post:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="md:col-span-1">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:border-primary"
            >
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="art">Art</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            onClick={() => setFilters({ category: '', search: '', page: 1 })}
            className="w-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      </aside>

      {/* Feed */}
      <main className="md:col-span-3">
        {error && <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded mb-4">{error}</div>}

        {loading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No posts found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div>
            {posts.map(post => (
              <PostCard key={post._id} post={post} onLike={handleLike} onUnlike={handleUnlike} />
            ))}
          </div>
        )}
      </main>
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
    </div>
  );
}
