import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Keeps "who is logged in" available to every page
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page reload, ask the server who we are (if we have a token)
  useEffect(() => {
    if (!localStorage.getItem('servease_token')) return setLoading(false);
    api.get('/auth/me').then((r) => setUser(r.data.user)).catch(() => localStorage.removeItem('servease_token')).finally(() => setLoading(false));
  }, []);

  const saveSession = ({ token, user }) => {
    localStorage.setItem('servease_token', token);
    setUser(user);
    return user;
  };
  const login = async (email, password) => saveSession((await api.post('/auth/login', { email, password })).data);
  const register = async (data) => saveSession((await api.post('/auth/register', data)).data);
  const logout = () => { localStorage.removeItem('servease_token'); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

// Where each role lands after login
export const homeFor = (role) => ({ customer: '/requests', worker: '/jobs', admin: '/admin' }[role] || '/');
