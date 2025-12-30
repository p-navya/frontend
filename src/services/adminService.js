import { apiRequest } from '../config/api.js';

// Get admin statistics
export const getAdminStats = async () => {
  return await apiRequest('/admin/stats');
};

// Create mentor
export const createMentor = async (mentorData) => {
  return await apiRequest('/admin/mentors', {
    method: 'POST',
    body: JSON.stringify(mentorData),
  });
};

// Get all mentors
export const getMentors = async () => {
  return await apiRequest('/admin/mentors');
};

