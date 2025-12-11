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
      </div>
    </div>
  );
}
