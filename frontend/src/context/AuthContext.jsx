import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('jwt');
    if (stored) {
      setToken(stored);
      try {
        const decoded = jwtDecode(stored);
        setUser({
          id: decoded.userId,
          name: decoded.name || 'Fullstack Tester',
          email: decoded.email || decoded.sub,
          role: decoded.role || 'FACULTY',
        });
      } catch (e) {
        console.error('Invalid token in storage');
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
      }
    }
  }, []);

  const login = (newToken, newRefreshToken) => {
    localStorage.setItem('jwt', newToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      setUser({
        id: decoded.userId,
        name: decoded.name || 'Fullstack Tester',
        email: decoded.email || decoded.sub,
        role: decoded.role || 'FACULTY',
      });
    } catch (e) {
      console.error('Invalid token on login');
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
