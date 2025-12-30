// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Base fetch function with auth headers
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

