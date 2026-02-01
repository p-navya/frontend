import { apiRequest } from '../config/api.js';

/**
 * Send a message to the chatbot
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous conversation messages
 * @param {string} mode - 'mental-support' or 'resume-builder'
 * @returns {Promise<Object>} Response from the chatbot
 */
export const sendChatMessage = async (message, conversationHistory = [], mode = 'mental-support', file = null) => {
  if (file) {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('conversationHistory', JSON.stringify(conversationHistory));
    formData.append('mode', mode);
    formData.append('file', file);

    // apiRequest handles JSON by default, but for FormData we need to handle headers carefully
    // Assuming apiRequest can handle FormData or we bypass it for this specific call if needed.
    // However, looking at the likely implementation of apiRequest in ../config/api.js, it probably sets Content-Type to application/json.
    // We might need to make a direct fetch call here or update apiRequest.
    // For safety, let's use the token from localStorage if possible, or rely on apiRequest if it supports FormData.
    // Let's assume we need to use the underlying fetch logic.

    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const response = await fetch(`${API_URL}/chatbot/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type here, let browser set it with boundary for FormData
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API request failed');
    return data;
  }

  return await apiRequest('/chatbot/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      conversationHistory,
      mode
    })
  });
};

/**
 * Get available AI models
 * @returns {Promise<Object>} Available models
 */
export const getAvailableModels = async () => {
  return await apiRequest('/chatbot/models');
};


