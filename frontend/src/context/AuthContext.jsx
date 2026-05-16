import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to fetch current user on mount (session check)
  useEffect(() => {
    api.get('/get-user')
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, tokens) => {
    setUser(userData);
    if (tokens?.accessToken) localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens?.refreshToken) localStorage.setItem('refreshToken', tokens.refreshToken);
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch (_) { /* ignore */ }
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/get-user');
      setUser(res.data.data);
    } catch (_) { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
