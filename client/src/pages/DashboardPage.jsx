<<<<<<< HEAD
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-primary">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Active Rooms</h3>
          <p className="text-3xl font-bold text-green-500">567</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Games Played</h3>
          <p className="text-3xl font-bold text-purple-500">8,901</p>
        </div>
=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userStats = user?.statistics || {
          postsCreated: 0,
          gamesPlayed: 0,
          roomsJoined: 0,
          communitiesJoined: 0,
        };
        setStats(userStats);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Dashboard</h1>

        {/* Stats Cards */}
        {loading ? (
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg">
                <div className="text-3xl font-bold text-blue-600">{stats?.postsCreated || 0}</div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Posts Created</p>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg">
                <div className="text-3xl font-bold text-green-600">{stats?.gamesPlayed || 0}</div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Games Played</p>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-600">{stats?.roomsJoined || 0}</div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Rooms Joined</p>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg">
                <div className="text-3xl font-bold text-orange-600">{stats?.communitiesJoined || 0}</div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Communities</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-700 rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Quick Actions</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="/rooms" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-semibold">
                  Explore Rooms
                </a>
                <a href="/communities" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center font-semibold">
                  Find Communities
                </a>
                <a href="/games" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center font-semibold">
                  Play Games
                </a>
                <a href="/settings" className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition text-center font-semibold">
                  Settings
                </a>
              </div>
            </div>
          </>
        )}
>>>>>>> 9854696 (feat: Transform into comprehensive entertainment + social platform)
      </div>
    </div>
  );
}
