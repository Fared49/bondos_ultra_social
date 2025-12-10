import React from 'react';
import { Link } from 'react-router-dom';

export default function RoomCard({ room }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg">{room.name}</h3>
          <p className="text-sm text-gray-600">{room.members.length} أعضاء</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          room.privacy === 'public' ? 'bg-green-100 text-green-800' :
          room.privacy === 'private' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {room.privacy}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{room.description}</p>
      <Link
        to={`/rooms/${room._id}`}
        className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
      >
        فتح →
      </Link>
    </div>
  );
}
