import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative px-6 py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Bondos Ultra Social
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              The ultimate entertainment + social platform where communities meet, games come alive, and connections flourish
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Get Started Free
              </Link>
              <Link to="/login" className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition">
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-2xl">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 h-96 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                <p>Platform Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900 dark:text-white">
            Why Choose Bondos Ultra Social?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎮', title: 'Multiplayer Games', desc: 'Play XO, Memory, Cards, and more with friends in real-time' },
              { icon: '💬', title: 'Live Chat', desc: 'Instant messaging with Socket.IO powered real-time updates' },
              { icon: '🏰', title: 'Private Rooms', desc: 'Create exclusive spaces for your communities' },
              { icon: '👥', title: 'Communities', desc: 'Join or create communities around your interests' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized performance with modern technologies' },
              { icon: '🌙', title: 'Dark Mode', desc: 'Multiple themes including Dark, Neon, and Cyber' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-lg bg-slate-50 dark:bg-slate-700 hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900 dark:text-white">
            8 Exciting Games
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'XO (Tic-Tac-Toe)',
              'Cards',
              'Guess the Movie',
              'Guess the Word',
              'Describe Me',
              'Snakes & Ladders',
              'Memory Match',
              'Quick Questions',
            ].map((game, i) => (
              <div key={i} className="p-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white text-center font-semibold hover:shadow-xl transition">
                {game}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900 dark:text-white">
            What Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Ahmed', feedback: 'Best gaming and social platform ever!' },
              { name: 'Fatima', feedback: 'Love the community features and real-time chat' },
              { name: 'Mohammed', feedback: 'Amazing experience, highly recommended!' },
            ].map((testimonial, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-slate-700 dark:text-slate-300 mb-4 italic">"{testimonial.feedback}"</p>
                <p className="font-bold text-slate-900 dark:text-white">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Community?</h2>
          <p className="text-xl mb-8 text-blue-100">Start creating rooms, playing games, and connecting with others today!</p>
          <Link to="/register" className="px-10 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition inline-block">
            Create Your Account Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Bondos Ultra Social</h4>
              <p className="text-slate-400">Entertainment meets community</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>Multiplayer Games</li>
                <li>Live Rooms</li>
                <li>Communities</li>
                <li>Real-time Chat</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>Documentation</li>
                <li>FAQ</li>
                <li>Support</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 Bondos Ultra Social. All rights reserved.</p>
          </div>
        </div>
      </footer>
>>>>>>> 9854696 (feat: Transform into comprehensive entertainment + social platform)
    </div>
  );
}
