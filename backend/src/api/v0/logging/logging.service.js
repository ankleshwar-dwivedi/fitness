import MealLog from "./mealLog.model.js";
import WorkoutLog from "./workoutLog.model.js";
import WaterLog from "../water/waterLog.model.js";
import Food from "../library/food.model.js";
import Exercise from "../library/exercise.model.js";
import FitnessPlan from "../fitness/fitness.model.js";
import { updateStreaks } from "../../../services/streaks.service.js";
import AppError from "../../../utils/AppError.js";
import mongoose from "mongoose";

// Helper to normalize date to the start of the day in UTC
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

class LoggingService {
  async createMealLog(userId, items, mealType, dateStr) {
    // **THE FIX IS HERE: Add validation**
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError("Meal items are required.", 400);
    }

    const date = normalizeDate(dateStr || new Date());
    let totalCalories = 0,
      totalProtein = 0,
      totalCarbs = 0,
      totalFat = 0;

    // Use Promise.all for more efficient database lookups
    const foodDocs = await Food.find({
      _id: { $in: items.map((i) => i.foodId) },
    });

    const foodMap = new Map(foodDocs.map((doc) => [doc._id.toString(), doc]));

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.foodId)) {
        throw new AppError(`Invalid food ID format: ${item.foodId}`, 400);
      }
      const foodDoc = foodMap.get(item.foodId);
      if (!foodDoc) {
        throw new AppError(`Food item with ID ${item.foodId} not found.`, 404);
      }

      const multiplier = item.quantity / 100;
      totalCalories += (foodDoc.calories || 0) * multiplier;
      totalProtein += (foodDoc.protein || 0) * multiplier;
      totalCarbs += (foodDoc.carbs || 0) * multiplier;
      totalFat += (foodDoc.fat || 0) * multiplier;
    }

    const mealLog = await MealLog.create({
      user: userId,
      date,
      mealType,
      items: items,
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
    });

    await updateStreaks(userId, "diet");
    return mealLog;
  }

  async createWorkoutLog(userId, logData, dateStr) {
    const { exerciseId, performance } = logData;
    const date = normalizeDate(dateStr || new Date());

    const [exercise, fitnessPlan, user] = await Promise.all([
      Exercise.findById(exerciseId),
      FitnessPlan.findOne({ user: userId }),
      User.findById(userId), // Need the user for their weight
    ]);

    if (!exercise) throw new AppError("Exercise not found.", 404);
    if (!user || !fitnessPlan)
      throw new AppError(
        "User profile and fitness plan are required to log workouts.",
        400
      );

    // **THE FIX IS HERE: Differentiated calorie calculation**
    let caloriesBurned = 0;
    let durationHours = 0;

    if (performance.durationMin) {
      // Cardio workout
      durationHours = performance.durationMin / 60;
    } else if (performance.sets && performance.sets.length > 0) {
      // Strength workout
      // Estimate duration: assume ~2 minutes per set (including rest)
      const estimatedDurationMin = performance.sets.length * 2;
      durationHours = estimatedDurationMin / 60;
    }

    if (durationHours > 0) {
      caloriesBurned = Math.round(
        exercise.metValue * fitnessPlan.weightKg * durationHours
      );
    } else {
      // Fallback if no performance data is provided
      caloriesBurned = 0;
    }

    const workoutLog = await WorkoutLog.create({
      user: userId,
      date,
      exercise: exerciseId,
      performance,
      caloriesBurned,
    });

    await updateStreaks(userId, "workout");
    return workoutLog;
  }

  async createWaterLog(userId, amount, dateStr) {
    // **THE FIX IS HERE:** Add explicit validation for the amount.
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new AppError("A valid, positive amount of water is required.", 400);
    }

    const date = normalizeDate(dateStr || new Date());
    const waterLog = await WaterLog.create({
      user: userId,
      date,
      amount: parsedAmount,
    });

    // Also call the streak updater for water logs
    await updateStreaks(userId, "diet");
    return waterLog;
  }
  async getDailyLogs(userId, dateStr) {
    const date = normalizeDate(dateStr);
    const [meals, workouts, water] = await Promise.all([
      MealLog.find({ user: userId, date }),
      WorkoutLog.find({ user: userId, date }),
      WaterLog.find({ user: userId, date }),
    ]);
    const totalWater = water.reduce((sum, log) => sum + log.amount, 0);
    return { meals, workouts, water: { logs: water, total: totalWater } };
  }
}

export default new LoggingService();
