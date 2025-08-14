import edamamService from '../../../services/external/edamam.service.js';
import wgerService from '../../../services/external/wger.service.js';
import FitnessPlan from '../fitness/fitness.model.js';
import AppError from '../../../utils/AppError.js';

class PlannerService {
  async generateUserMealPlan(userId) {
    const fitnessPlan = await FitnessPlan.findOne({ user: userId });
    if (!fitnessPlan) {
      throw new AppError('You must create a fitness profile first to get a meal plan.', 400);
    }
    
    // Pass the user's target calories to the meal plan generator
    const mealPlan = await edamamService.generateMealPlan(fitnessPlan.tdee);
    return mealPlan;
  }

  async generateUserWorkoutPlan(userId) {
    const fitnessPlan = await FitnessPlan.findOne({ user: userId });
    if (!fitnessPlan) {
      throw new AppError('You must create a fitness profile first to get a workout plan.', 400);
    }
    
    // The workout plan service could be enhanced to use the user's goal
    const workoutPlan = await wgerService.generateWorkoutPlan();
    return workoutPlan;
  }
}

export default new PlannerService();