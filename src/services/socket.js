import { io } from 'socket.io-client';
import { API_URL } from './api';

// Opens a real-time connection, proving who we are with the login token
export const connectSocket = () => io(API_URL, { auth: { token: localStorage.getItem('servease_token') } });
