import MealLog from '../logging/mealLog.model.js';
import WorkoutLog from '../logging/workoutLog.model.js';
import mongoose from 'mongoose';

const getStartDate = (period = 'weekly') => {
    const now = new Date();
    if (period === 'monthly') return new Date(now.getFullYear(), now.getMonth(), 1);
    if (period === 'all') return new Date(0); // The epoch for all time
    // Default to weekly
    const lastWeek = new Date(now.setDate(now.getDate() - 7));
    return lastWeek;
}

class AnalyzerService {
    async analyzeNutrition(userId, period) {
        const startDate = getStartDate(period);
        const match = { user: new mongoose.Types.ObjectId(userId), date: { $gte: startDate } };
        
        const nutritionData = await MealLog.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalCalories: { $sum: '$calories' },
                    totalProtein: { $sum: '$protein_g' },
                    totalCarbs: { $sum: '$carbohydrates_total_g' },
                    totalFat: { $sum: '$fat_total_g' },
                    logDays: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalCalories: 1,
                    totalProtein: 1,
                    totalCarbs: 1,
                    totalFat: 1,
                    avgDailyCalories: { $divide: ['$totalCalories', { $size: '$logDays' }] }
                }
            }
        ]);

        return nutritionData[0] || { message: "No nutrition data for this period." };
    }

    async analyzeWorkouts(userId, period) {
        const startDate = getStartDate(period);
        const match = { user: new mongoose.Types.ObjectId(userId), date: { $gte: startDate } };

        const workoutData = await WorkoutLog.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalMinutes: { $sum: '$durationMin' },
                    totalCaloriesBurned: { $sum: '$caloriesBurned' }
                }
            },
             {
                $project: {
                    _id: 0,
                    totalWorkouts: 1,
                    totalMinutes: 1,
                    totalCaloriesBurned: 1,
                    avgWorkoutMinutes: { $divide: ['$totalMinutes', '$totalWorkouts'] }
                }
            }
        ]);

        return workoutData[0] || { message: "No workout data for this period." };
    }
}

export default new AnalyzerService();