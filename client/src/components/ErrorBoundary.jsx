import React from 'react';

export default function ErrorBoundary({ error, reset }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ</h2>
        <p className="text-gray-600 mb-4">{error?.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          حاول مجددًا
        </button>
      </div>
    </div>
  );
}
