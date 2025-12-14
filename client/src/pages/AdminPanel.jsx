import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Access Denied</h1>
          <p className="text-slate-600 dark:text-slate-400">You need admin privileges to access this panel</p>
        </div>
      </div>
    );
  }

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data } = await api.get('/admin/rooms');
      setRooms(data.rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const fetchCommunities = async () => {
    try {
      const { data } = await api.get('/admin/communities');
      setCommunities(data.communities);
    } catch (error) {
      console.error('Failed to fetch communities:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/admin/reports');
      setReports(data.reports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/ban`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to ban user:', error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/admin/rooms/${roomId}`);
        fetchRooms();
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    switch (activeTab) {
      case 'stats':
        fetchStats();
        break;
      case 'users':
        fetchUsers();
        break;
      case 'rooms':
        fetchRooms();
        break;
      case 'communities':
        fetchCommunities();
        break;
      case 'reports':
        fetchReports();
        break;
      default:
        break;
    }
    setLoading(false);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-300 dark:border-slate-600">
          {['stats', 'users', 'rooms', 'communities', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-8 shadow-lg">
          {loading ? (
            <p className="text-slate-600 dark:text-slate-400">Loading...</p>
          ) : activeTab === 'stats' && stats ? (
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Total Users</p>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{stats.totalRooms}</div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Total Rooms</p>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{stats.totalCommunities}</div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Communities</p>
              </div>
              <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{stats.pendingReports}</div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Pending Reports</p>
              </div>
            </div>
          ) : activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-600">
                    <th className="text-left py-3 px-4 font-semibold">Username</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-slate-200 dark:border-slate-600">
                      <td className="py-3 px-4">{u.username}</td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">{u.role}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleBanUser(u._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Ban
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'rooms' ? (
            <div className="space-y-4">
              {rooms.map((room) => (
                <div key={room._id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-600 rounded-lg">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{room.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{room.members.length} members</p>
                  </div>
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : activeTab === 'communities' ? (
            <div className="space-y-4">
              {communities.map((community) => (
                <div key={community._id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-600 rounded-lg">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{community.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{community.totalMembers} members</p>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'reports' ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report._id} className="p-4 bg-slate-50 dark:bg-slate-600 rounded-lg">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{report.reason}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{report.description}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
