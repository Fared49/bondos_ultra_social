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
    </div>
  );
}
