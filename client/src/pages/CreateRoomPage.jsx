import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsAPI } from '../services/api.js';

export default function CreateRoomPage() {
  const [form, setForm] = useState({ name: '', description: '', privacy: 'public' });
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await roomsAPI.create(form);
      navigate(`/rooms/${res.data._id}`);
    } catch (err) {
      alert('Room creation failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Create Room</h2>
        <form onSubmit={handleCreate}>
          <input type="text" placeholder="Room Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border mb-4 rounded" required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border mb-4 rounded"></textarea>
          <select value={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.value })} className="w-full p-2 border mb-4 rounded">
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="invite">Invite Only</option>
          </select>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded">Create</button>
        </form>
      </div>
    </div>
  );
}
