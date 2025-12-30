import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getCurrentUser, logout as logoutService } from '../services/authService';

const AuthContext = createContext(null);

// Export useAuth hook - eslint-disable for common pattern
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    logoutService();
  }, []);

  const login = useCallback((userData, token, firstLogin = false) => {
    setUser({ ...userData, first_login: firstLogin });
    setIsAuthenticated(true);
    if (token) {
      localStorage.setItem('token', token);
    }
  }, []);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getCurrentUser();
          if (response.success) {
            setUser({ ...response.data.user, first_login: response.data.firstLogin || false });
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [logout]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

