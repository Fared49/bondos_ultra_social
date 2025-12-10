import React, { useState } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [notifications, setNotifications] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Settings</h1>

        {/* Profile Settings */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">Username</label>
              <input
                type="text"
                defaultValue="username"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">Email</label>
              <input
                type="email"
                defaultValue="user@example.com"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
              />
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['light', 'dark', 'neon', 'cyber'].map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={`p-4 rounded-lg font-semibold transition ${
                  theme === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-500'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="ml-3 text-slate-700 dark:text-slate-300">Enable all notifications</span>
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Privacy</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="ml-3 text-slate-700 dark:text-slate-300">Make profile private</span>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Security</h2>
          <div className="space-y-4">
            <button className="w-full px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Change Password
            </button>
            <button className="w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Danger Zone</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
