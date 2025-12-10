import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-6">Page Not Found</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-lg">Go Home</a>
      </div>
    </div>
  );
}
