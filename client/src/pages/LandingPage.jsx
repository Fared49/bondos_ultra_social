import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h1 className="text-6xl font-bold mb-4">Bondos Ultra Social</h1>
        <p className="text-2xl mb-8">Realtime Social Platform with Games & Rooms</p>
        <div className="flex gap-4">
          <Link to="/login" className="px-8 py-3 bg-white text-primary font-bold rounded-lg">Login</Link>
          <Link to="/register" className="px-8 py-3 bg-transparent border-2 border-white font-bold rounded-lg">Register</Link>
        </div>
        <div className="mt-16 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <p className="mb-4">✨ Realtime Chat & Presence | 🎮 Multiplayer Games | 🏠 Virtual Rooms | 📱 Social Posts</p>
        </div>
      </div>
    </div>
  );
}
