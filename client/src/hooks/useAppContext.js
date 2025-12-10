import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext.jsx';
import { SocketContext } from '../store/SocketContext.jsx';

export function useAuth() {
  return useContext(AuthContext);
}

export function useSocket() {
  return useContext(SocketContext);
}
