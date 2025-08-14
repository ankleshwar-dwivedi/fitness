import axios from 'axios';
import config from '../../config/index.js';
import AppError from '../../utils/AppError.js';

class WorkoutService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.api-ninjas.com/v1',
      headers: { 'X-Api-Key': config.apiKeys.apiNinjasWorkout },
    });
  }

  async getCaloriesBurned(activity) {
    if (!config.apiKeys.apiNinjasWorkout) {
        console.warn('API-Ninjas Workout API key not set. Returning 0 calories.');
        return 0;
    }
    if (!activity) {
      throw new AppError('An activity must be provided.', 400);
    }
    try {
      const response = await this.api.get(`/caloriesburned?activity=${activity}`);
      // The API returns an array, we sum the total calories
      return response.data.reduce((sum, item) => sum + item.total_calories, 0);
    } catch (error) {
      console.error('API-Ninjas CaloriesBurned Error:', error.message);
      throw new AppError('Failed to fetch calories burned data.', 502);
    }
  }
}

export default new WorkoutService();