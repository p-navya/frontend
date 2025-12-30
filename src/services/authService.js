import { apiRequest, setAuthToken, removeAuthToken } from '../config/api.js';

// Register a new user
export const register = async (userData) => {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (response.success && response.data.token) {
    setAuthToken(response.data.token);
  }

  return response;
};

// Login user
export const login = async (credentials) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (response.success && response.data.token) {
    setAuthToken(response.data.token);
  }

  return response;
};

// Get current user
export const getCurrentUser = async () => {
  return await apiRequest('/auth/me');
};

// Logout user
export const logout = () => {
  removeAuthToken();
};

