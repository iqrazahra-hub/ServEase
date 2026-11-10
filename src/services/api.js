import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// One axios instance. It adds the login token to every request automatically.
const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('servease_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn any error into a readable sentence
export const errMsg = (e) => e?.response?.data?.message || e.message || 'Something went wrong.';

export default api;
