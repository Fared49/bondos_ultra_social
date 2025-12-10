import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', isPrivate: false });
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`/api/rooms?search=${search}`);
      setRooms(data.rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [search]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/rooms', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setShowCreateModal(false);
      setFormData({ name: '', description: '', isPrivate: false });
      fetchRooms();
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await axios.post(`/api/rooms/${roomId}/join`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Rooms</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Room
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No rooms found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white dark:bg-slate-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{room.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">{room.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {room.members.length} / {room.maxMembers} members
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${room.isPrivate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {room.isPrivate ? 'Private' : 'Public'}
                  </span>
                </div>
                <button
                  onClick={() => handleJoinRoom(room._id)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Join Room
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-700 rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Create Room</h2>
              <form onSubmit={handleCreateRoom}>
                <div className="mb-4">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">Room Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="mb-6 flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <label className="ml-2 text-slate-700 dark:text-slate-300">Private Room</label>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
