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
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError("Meal items are required.", 400);
    }

    const date = normalizeDate(dateStr || new Date());
    let totalCalories = 0,
      totalProtein = 0,
      totalCarbs = 0,
      totalFat = 0;

    const foodDocs = await Food.find({
      _id: { $in: items.map((i) => i.foodId) },
    });

    const foodMap = new Map(foodDocs.map((doc) => [doc._id.toString(), doc]));

    // FIX IS HERE: Create a new array that matches the schema
    const itemsForDb = items.map((item) => {
      const foodDoc = foodMap.get(item.foodId);
      if (!foodDoc) {
        throw new AppError(`Food item with ID ${item.foodId} not found.`, 404);
      }
      const multiplier = item.quantity / 100;
      totalCalories += (foodDoc.calories || 0) * multiplier;
      totalProtein += (foodDoc.protein || 0) * multiplier;
      totalCarbs += (foodDoc.carbs || 0) * multiplier;
      totalFat += (foodDoc.fat || 0) * multiplier;

      // Return an object with the correct 'food' property name
      return { food: item.foodId, quantity: item.quantity };
    });

    const mealLog = await MealLog.create({
      user: userId,
      date,
      mealType,
      items: itemsForDb, // Use the correctly formatted array
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
    });

    await updateStreaks(userId, "diet");
    return mealLog;
  }

  async createWorkoutLog(userId, logData, dateStr) {
    // FIX IS HERE: Add a guard clause to ensure userId is valid
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user authentication.", 401);
    }

    const { exerciseId, performance } = logData;
    const date = normalizeDate(dateStr || new Date());

    const [exercise, fitnessPlan] = await Promise.all([
      Exercise.findById(exerciseId),
      FitnessPlan.findOne({ user: userId }),
    ]);

    if (!exercise) throw new AppError("Exercise not found.", 404);
    if (!fitnessPlan)
      throw new AppError("A fitness plan is required to log workouts.", 400);

    let caloriesBurned = 0;
    const durationMin = performance?.durationMin;

    if (durationMin && typeof durationMin === "number" && durationMin > 0) {
      const durationHours = durationMin / 60;
      caloriesBurned = Math.round(
        exercise.metValue * fitnessPlan.weightKg * durationHours
      );
    } else if (performance?.sets?.length > 0) {
      const estimatedDurationMin = performance.sets.length * 2;
      const durationHours = estimatedDurationMin / 60;
      caloriesBurned = Math.round(
        exercise.metValue * fitnessPlan.weightKg * durationHours
      );
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
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new AppError("A valid, positive amount of water is required.", 400);
    }
    const date = normalizeDate(dateStr || new Date());

    // FIX IS HERE: Use findOneAndUpdate with upsert and $inc
    const waterLog = await WaterLog.findOneAndUpdate(
      { user: userId, date: date },
      { $inc: { amount: parsedAmount } },
      { new: true, upsert: true, runValidators: true }
    );

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
