<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAppContext.js';
import { authAPI } from '../services/api.js';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    authAPI.getProfile().then(res => setProfile(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-4">{profile?.username}</h1>
        <p className="text-gray-600 mb-4">{profile?.bio}</p>
        <div className="flex gap-8 mb-6">
          <div><strong>Following</strong> <span className="text-2xl">{profile?.following.length}</span></div>
          <div><strong>Followers</strong> <span className="text-2xl">{profile?.followers.length}</span></div>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded">Edit Profile</button>
      </div>
=======
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI, postsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [profileRes, postsRes] = await Promise.all([
        usersAPI.getProfile(userId),
        postsAPI.getUserPosts(userId),
      ]);
      setProfile(profileRes.data);
      setPosts(postsRes.data.posts);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!profile) return <div>Profile not found</div>;

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Profile Card */}
      <aside className="md:col-span-1">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 sticky top-8">
          <img
            src={profile.avatar || 'https://via.placeholder.com/150'}
            alt={profile.username}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <h1 className="text-2xl font-bold mb-1">{profile.username}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {profile.firstName} {profile.lastName}
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-4">{profile.bio}</p>

          <div className="flex gap-4 mb-4 text-sm">
            <div>
              <p className="font-semibold">{profile.followers.length}</p>
              <p className="text-gray-600 dark:text-gray-400">Followers</p>
            </div>
            <div>
              <p className="font-semibold">{profile.following.length}</p>
              <p className="text-gray-600 dark:text-gray-400">Following</p>
            </div>
          </div>

          {!isOwnProfile && (
            <button className="w-full bg-primary hover:bg-blue-600 text-white py-2 rounded-lg transition">
              Follow
            </button>
          )}
        </div>
      </aside>

      {/* Posts */}
      <main className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-6">Posts by {profile.username}</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">No posts yet</p>
        ) : (
          posts.map(post => (
            <PostCard key={post._id} post={post} onLike={() => {}} onUnlike={() => {}} />
          ))
        )}
      </main>
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
    </div>
  );
}
