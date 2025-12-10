import React, { useState } from 'react';

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { id: 'xo', name: 'XO (Tic-Tac-Toe)', icon: '❌', players: '2 players', description: 'Classic tic-tac-toe game' },
    { id: 'cards', name: 'Cards', icon: '🃏', players: '2-4 players', description: 'Strategic card game' },
    { id: 'movie', name: 'Guess the Movie', icon: '🎬', players: '2+ players', description: 'Guess movies from clues' },
    { id: 'word', name: 'Guess the Word', icon: '📝', players: '2+ players', description: 'Guess words from hints' },
    { id: 'describe', name: 'Describe Me', icon: '🎤', players: '3+ players', description: 'Describe words to teammates' },
    { id: 'snakes', name: 'Snakes & Ladders', icon: '🐍', players: '2-4 players', description: 'Classic board game' },
    { id: 'memory', name: 'Memory Match', icon: '🧠', players: '1+ players', description: 'Match pairs of cards' },
    { id: 'quiz', name: 'Quick Questions', icon: '❓', players: '1+ players', description: 'Answer trivia questions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Games</h1>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition cursor-pointer"
            >
              <div className="text-5xl mb-4">{game.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{game.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{game.description}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">{game.players}</p>
            </div>
          ))}
        </div>

        {/* Game Details Modal */}
        {selectedGame && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-700 rounded-lg p-8 max-w-md w-full">
              <div className="text-6xl text-center mb-6">{selectedGame.icon}</div>
              <h2 className="text-2xl font-bold text-center mb-4 text-slate-900 dark:text-white">{selectedGame.name}</h2>
              <p className="text-center text-slate-600 dark:text-slate-400 mb-6">{selectedGame.description}</p>
              <p className="text-center text-sm text-slate-500 dark:text-slate-500 mb-6">{selectedGame.players}</p>
              <div className="flex gap-4">
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                  Play Now
                </button>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex-1 px-4 py-3 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
