import FitnessPlan from "../fitness/fitness.model.js";
import MealLog from "../logging/mealLog.model.js";
import WorkoutLog from "../logging/workoutLog.model.js";
import WaterLog from "../water/waterLog.model.js";
import WeightLog from "../logging/weightLog.model.js";
import mongoose from "mongoose";

const getStartOfDayUTC = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

class DashboardService {
  async generateTodaySummary(userId) {
    const today = getStartOfDayUTC(new Date());

    const [plan, todayMeals, todayWorkouts, todayWater] = await Promise.all([
      FitnessPlan.findOne({ user: userId }).lean(),
      MealLog.find({ user: userId, date: today }).lean(),
      WorkoutLog.find({ user: userId, date: today }).lean(),
      WaterLog.find({ user: userId, date: today }).lean(),
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
    );
    const caloriesBurned = todayWorkouts.reduce(
      (sum, workout) => sum + workout.caloriesBurned,
      0
    );
    const waterConsumed = todayWater.reduce((sum, log) => sum + log.amount, 0);

    // NEW: Define a workout calorie goal, e.g., 15% of TDEE or a minimum of 300
    const workoutCalorieGoal = Math.max(300, Math.round(plan.tdee * 0.15));
    const surplusCalories =
      caloriesConsumed - plan.tdee + (workoutCalorieGoal - caloriesBurned);

    return {
      hasPlan: true,
      calorieGoal: plan.tdee,
      caloriesConsumed,
      caloriesBurned,
      caloriesLeft: plan.tdee - caloriesConsumed + caloriesBurned,
      waterConsumed,
      waterGoal: 3000,
      workoutCalorieGoal, // NEW
      surplusCalories, // NEW
    };
  }

  async generatePerformanceReport(userId, range = "weekly") {
    const now = new Date();
    let startDate;

    if (range === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(now.setDate(now.getDate() - 7));
    }
    startDate = getStartOfDayUTC(startDate);

    const matchCriteria = {
      user: new mongoose.Types.ObjectId(userId),
      date: { $gte: startDate },
    };

    const [calorieConsumption, calorieBurn, weightHistory] = await Promise.all([
      MealLog.aggregate([
        { $match: matchCriteria },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalCalories: { $sum: "$totalCalories" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      WorkoutLog.aggregate([
        { $match: matchCriteria },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalCaloriesBurned: { $sum: "$caloriesBurned" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      WeightLog.aggregate([
        { $match: matchCriteria },
        {
          $project: {
            _id: 0,
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            weight: "$weightKg",
          },
        },
        { $sort: { date: 1 } },
      ]),
    ]);

    return {
      range,
      startDate,
      calorieConsumption,
      calorieBurn,
      weightHistory, // ADDED
    };
  }
}

export default new DashboardService();
