import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v0';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const getGoogleAuthUrl = () => api.get('/auth/google/url'); // New
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const logoutUser = () => api.post('/auth/logout');

// User & Profile
export const getMyProfile = () => api.get('/users/me');
export const updateMyProfile = (data) => api.put('/users/me', data);
export const getFitnessPlan = () => api.get('/fitness/plan');
export const upsertFitnessPlan = (data) => api.put('/fitness/plan', data);

// Logging
export const logMeal = (data) => api.post('/log/meals', data);
export const logWorkout = (data) => api.post('/log/workouts', data);
export const logWater = (data) => api.post('/water/add', data);
export const getWaterForDate = (date) => api.get(`/water/${date}`);

// Dashboard
export const getTodaySummary = () => api.get('/dashboard/today');
export const getPerformanceReport = (range) => api.get(`/dashboard/performance?range=${range}`);

// Planners
export const getMealPlan = () => api.get('/planners/meal');
export const getWorkoutPlan = () => api.get('/planners/workout');

// Admin
export const getAdminDashboardStats = () => api.get('/admin/stats'); // Correctly added
export const adminGetAllUsers = () => api.get('/admin/users');
export const adminDeleteUser = (userId) => api.delete(`/admin/users/${userId}`);
export const adminChangeUserPassword = (userId, data) => api.put(`/admin/users/${userId}/password`, data);


//Chatbit

export const processChatbotMessage = (payload) => api.post('/chatbot/message', payload);

export default api;