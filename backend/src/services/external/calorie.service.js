import axios from 'axios';
import config from '../../config/index.js';
import AppError from '../../utils/AppError.js';

class CalorieService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.calorieninjas.com/v1',
      headers: { 'X-Api-Key': config.apiKeys.calorieNinjas },
    });
  }

  async getNutritionalInfo(query) {
    if (!config.apiKeys.calorieNinjas) {
        console.warn('CalorieNinjas API key not set. Returning 0 values.');
        return { calories: 0, protein_g: 0, carbohydrates_total_g: 0, fat_total_g: 0 };
    }
    if (!query) {
      throw new AppError('A food query must be provided.', 400);
    }
    try {
      const response = await this.api.get(`/nutrition?query=${query}`);
      // Sum up the values if multiple items are returned
      return response.data.items.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein_g: acc.protein_g + item.protein_g,
        carbohydrates_total_g: acc.carbohydrates_total_g + item.carbohydrates_total_g,
        fat_total_g: acc.fat_total_g + item.fat_total_g,
      }), { calories: 0, protein_g: 0, carbohydrates_total_g: 0, fat_total_g: 0 });
    } catch (error) {
      console.error('CalorieNinjas API Error:', error.message);
      throw new AppError('Failed to fetch nutritional data.', 502); // 502 Bad Gateway
    }
  }
}

export default new CalorieService();