import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['Gaming', 'Arts', 'Music', 'Sports', 'Education', 'Technology', 'Entertainment', 'Other'];

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data } = await api.get('/communities', { params: { search, category } });
        setCommunities(data.communities);
      } catch (error) {
        console.error('Failed to fetch communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [search, category]);

  const handleJoinCommunity = async (communityId) => {
    try {
      await api.post(`/communities/${communityId}/join`);
      alert('Joined community successfully!');
    } catch (error) {
      console.error('Failed to join community:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Communities</h1>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Loading communities...</p>
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No communities found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <div key={community._id} className="bg-white dark:bg-slate-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {community.banner && (
                  <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{community.name}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">{community.category}</p>
                  <p className="text-slate-700 dark:text-slate-400 mb-4 line-clamp-2">{community.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {community.totalMembers} members
                    </span>
                  </div>
                  <button
                    onClick={() => handleJoinCommunity(community._id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Join Community
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
