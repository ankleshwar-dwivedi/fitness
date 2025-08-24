import axios from 'axios';
import config from '../../config/index.js';
import AppError from '../../utils/AppError.js';

class SpoonacularService {
  constructor() {
    if (!config.apiKeys.spoonacular) {
        console.warn('Spoonacular API key is not configured.');
        // Don't throw here, but methods will check and fail gracefully.
    }
    this.api = axios.create({
      baseURL: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      headers: {
        'X-RapidAPI-Key': config.apiKeys.spoonacular,
        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
      }
    });
  }

  async generateMealPlan(targetCalories = 2000) {
    if (!config.apiKeys.spoonacular) {
        throw new AppError('The meal planning service is not available at the moment.', 503);
    }
    try {
      const response = await this.api.get('/mealplanner/generate', {
        params: {
          timeFrame: 'day',
          targetCalories: targetCalories,
          diet: 'vegetarian', // Example: make this user-configurable later
        }
      });
      
      // Transform the raw API data into a clean format for our frontend
      const rawPlan = response.data;
      const cleanPlan = {
        meals: rawPlan.meals.map(meal => ({
            id: meal.id,
            title: meal.title,
            readyInMinutes: meal.readyInMinutes,
            servings: meal.servings,
            sourceUrl: meal.sourceUrl,
        })),
        nutrients: {
            calories: rawPlan.nutrients.calories,
            protein: rawPlan.nutrients.protein,
            fat: rawPlan.nutrients.fat,
            carbohydrates: rawPlan.nutrients.carbohydrates,
        }
      };
      return cleanPlan;

    } catch (error) {
      console.error('Spoonacular API Error:', error.response?.data || error.message);
      throw new AppError('Failed to generate a meal plan from our provider.', 502); // 502 Bad Gateway
    }
  }
}

export default new SpoonacularService();