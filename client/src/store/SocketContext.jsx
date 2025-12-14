import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const tokensRaw = localStorage.getItem('tokens') || localStorage.getItem('token');

  useEffect(() => {
    if (!tokensRaw) return;

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    let accessToken = null;
    try {
      const tokens = JSON.parse(tokensRaw);
      accessToken = tokens?.accessToken || tokensRaw;
    } catch (e) {
      accessToken = tokensRaw;
    }

    if (!accessToken) return;

    const newSocket = io(serverUrl, {
      auth: { token: accessToken },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✓ Socket.io connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('✗ Socket.io disconnected');
      setIsConnected(false);
    });

    newSocket.on('users:online', (users) => {
      setActiveUsers(users);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        activeUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
