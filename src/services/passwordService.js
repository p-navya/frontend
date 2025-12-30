import { apiRequest } from '../config/api.js';

// Change password
export const changePassword = async (passwordData) => {
  return await apiRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  });
};

