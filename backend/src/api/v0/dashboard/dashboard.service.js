import FitnessPlan from "../fitness/fitness.model.js";
import MealLog from "../logging/mealLog.model.js";
import WorkoutLog from "../logging/workoutLog.model.js";
import WaterLog from "../water/waterLog.model.js";
import mongoose from "mongoose"; // FIX IS HERE: Add missing mongoose import

// Helper to get the start of the day in UTC
const getStartOfDayUTC = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

class DashboardService {
  async generateTodaySummary(userId) {
    // ... (This function remains the same)
    const today = getStartOfDayUTC(new Date());

    const [plan, todayMeals, todayWorkouts, todayWater] = await Promise.all([
      FitnessPlan.findOne({ user: userId }),
      MealLog.find({ user: userId, date: today }),
      WorkoutLog.find({ user: userId, date: today }),
      WaterLog.find({ user: userId, date: today }),
    ]);

    if (!plan) {
      return {
        hasPlan: false,
        message:
          "No fitness plan found. Please create one to see your dashboard.",
        calorieGoal: 2000,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        caloriesLeft: 2000,
        waterConsumed: 0,
        waterGoal: 3000,
        summary: { meals: [], workouts: [] },
      };
    }

    const caloriesConsumed = todayMeals.reduce(
      (sum, meal) => sum + meal.totalCalories,
      0
    ); // Corrected to use totalCalories
    const caloriesBurned = todayWorkouts.reduce(
      (sum, workout) => sum + workout.caloriesBurned,
      0
    );
    const waterConsumed = todayWater.reduce((sum, log) => sum + log.amount, 0);

    return {
      hasPlan: true,
      calorieGoal: plan.tdee,
      caloriesConsumed,
      caloriesBurned,
      caloriesLeft: plan.tdee - caloriesConsumed + caloriesBurned,
      waterConsumed,
      waterGoal: 3000, // A default goal
      summary: {
        meals: todayMeals,
        workouts: todayWorkouts,
      },
    };
  }

  async generatePerformanceReport(userId, range = "weekly") {
    const now = new Date();
    let startDate;

    if (range === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      // Default to weekly
      startDate = new Date(now.setDate(now.getDate() - 7));
    }
    startDate = getStartOfDayUTC(startDate);

    // This will now work because mongoose is imported
    const calorieConsumption = await MealLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCalories: { $sum: "$totalCalories" }, // Corrected field name
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const calorieBurn = await WorkoutLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCaloriesBurned: { $sum: "$caloriesBurned" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      range,
      startDate,
      calorieConsumption,
      calorieBurn,
    };
  }
}

export default new DashboardService();
