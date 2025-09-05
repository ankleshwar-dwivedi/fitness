import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v0';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Global error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/landing')) {
      // Forcibly clear any stale auth state and redirect to login
      window.location.href = '/landing';
    }
    return Promise.reject(error);
  }
);




// === AUTHENTICATION ===
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const logoutUser = () => api.post('/auth/logout');

// === USER & PROFILE ===
export const getMyProfile = () => api.get('/users/me');
export const updateMyProfile = (data) => api.put('/users/me', data);
export const getFitnessPlan = () => api.get('/fitness/plan');
export const upsertFitnessPlan = (data) => api.put('/fitness/plan', data);

// === LOGGING (MEALS, WORKOUTS, WATER) ===
export const logMeal = (data) => api.post('/log/meals', data);
export const logWorkout = (data) => api.post('/log/workouts', data);
export const logWater = (data) => api.post('/log/water', data);
export const getLogsForDate = (date) => api.get(`/log/date/${date}`);
export const logWeight = (data) => api.post('/log/weight', data); // weight feature

// === DASHBOARD & PERFORMANCE ===
export const getTodaySummary = () => api.get('/dashboard/today');
export const getPerformanceReport = (range) => api.get(`/dashboard/performance?range=${range}`);

// === AI PLANNERS ===
export const getMealPlan = () => api.get('/planners/meal');
export const getWorkoutPlan = () => api.get('/planners/workout');

// === DATA LIBRARY (for search) ===
export const searchFoods = (query) => api.get(`/library/foods?q=${query}`);
export const searchExercises = (query) => api.get(`/library/exercises?q=${query}`);

// === CHATBOT ===
export const processChatbotMessage = (payload) => api.post('/chatbot/message', payload);

// === ADMIN ===
export const getAdminDashboardStats = () => api.get('/admin/stats');
export const adminGetAllUsers = () => api.get('/admin/users');
export const adminDeleteUser = (userId) => api.delete(`/admin/users/${userId}`);
export const adminChangeUserPassword = (userId, data) => api.put(`/admin/users/${userId}/password`, data);

export default api;