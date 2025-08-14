import FitnessPlan from './fitness.model.js';
import AppError from '../../../utils/AppError.js';

class FitnessService {
  async getPlanByUserId(userId) {
    const plan = await FitnessPlan.findOne({ user: userId });
    if (!plan) {
      throw new AppError('Fitness plan not found for this user. Please create one.', 404);
    }
    return plan;
  }

  async createOrUpdatePlan(userId, planData) {
    const completePlanData = {
        user: userId,
        heightCm: planData.heightCm,
        weightKg: planData.weightKg,
        dateOfBirth: planData.dateOfBirth,
        gender: planData.gender,
        activityLevel: planData.activityLevel,
        goal: planData.goal
    };

    const plan = await FitnessPlan.findOneAndUpdate(
      { user: userId },
      completePlanData,
      { new: true, upsert: true, runValidators: true }
    );
    return plan; // This now returns the full plan object
  }
}

export default new FitnessService();