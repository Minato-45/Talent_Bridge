import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

let socket = null;

export const useSocket = () => {
  const { user } = useAuth();
  const connected = useRef(false);

  useEffect(() => {
    if (user && !connected.current) {
      socket = io(window.location.origin, {
        withCredentials: true,
      });

      socket.on('connect', () => {
        socket.emit('join', user._id);
        connected.current = true;
      });

      socket.on('disconnect', () => {
        connected.current = false;
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
        connected.current = false;
      }
    };
  }, [user]);

  return socket;
};

export const getSocket = () => socket;
