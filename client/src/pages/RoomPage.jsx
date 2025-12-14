import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { roomsAPI } from '../services/api.js';
import useSocket from '../hooks/useSocket.js';

export default function RoomPage() {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    roomsAPI.get(roomId).then(res => setRoom(res.data));
    roomsAPI.getMessages(roomId).then(res => setMessages(res.data));
    
    socket?.emit('room:join', roomId);
    socket?.on('chat:message', (msg) => setMessages(prev => [...prev, msg]));

    return () => socket?.off('chat:message');
  }, [roomId, socket]);

  const sendMessage = () => {
    socket?.emit('chat:message', roomId, message);
    setMessage('');
  };

  const startGame = (gameType) => {
    roomsAPI.startGame(roomId, { gameType, players: room.members.map(m => m._id) }).then(() => {
      setActiveGame(gameType);
    });
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-primary text-white p-4">
          <h2 className="text-2xl font-bold">{room?.name}</h2>
          <p className="text-sm">{room?.members.length} members</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2 p-2 bg-gray-100 rounded">
              <strong className="text-primary">{msg.sender?.username}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type message..." className="flex-1 p-2 border rounded" />
          <button onClick={sendMessage} className="bg-primary text-white px-4 py-2 rounded">Send</button>
        </div>
      </div>

      <div className="w-64 bg-gray-50 border-l p-4">
        <h3 className="font-bold mb-4">Games</h3>
        <div className="space-y-2">
          <button onClick={() => startGame('tictactoe')} className="w-full p-2 bg-blue-500 text-white rounded">TicTacToe</button>
          <button onClick={() => startGame('snakes')} className="w-full p-2 bg-green-500 text-white rounded">Snakes & Ladders</button>
          <button onClick={() => startGame('cards')} className="w-full p-2 bg-purple-500 text-white rounded">Card Game</button>
          <button onClick={() => startGame('guessing')} className="w-full p-2 bg-orange-500 text-white rounded">Guessing Game</button>
        </div>
        
        <h3 className="font-bold mt-6 mb-2">Members</h3>
        <div className="space-y-1">
          {room?.members.map(member => (
            <div key={member._id} className="flex items-center gap-2 text-sm p-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {member.username}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
