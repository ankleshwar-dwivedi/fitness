// /backend/src/api/v0/logging/logging.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";
import loggingService from "./logging.service.js";

export const logMeal = asyncHandler(async (req, res, next) => {
  const { items, mealType, date } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Meal items are required." });
  }
  const mealLog = await loggingService.createMealLog(
    req.user.id,
    items,
    mealType,
    date
  );
  res.status(201).json(mealLog);
});

export const logWorkout = asyncHandler(async (req, res, next) => {
  const date = req.body.date;
  const workoutLog = await loggingService.createWorkoutLog(
    req.user.id,
    req.body,
    date
  );
  res.status(201).json(workoutLog);
});

export const logWater = asyncHandler(async (req, res, next) => {
  const { amount, date } = req.body;
  const numericAmount = parseInt(amount, 10);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res
      .status(400)
      .json({ message: "A valid, positive water amount (in ml) is required." });
  }
  const waterLog = await loggingService.createWaterLog(
    req.user.id,
    numericAmount,
    date
  );
  res.status(201).json(waterLog);
});

// ADDED FUNCTION
export const logWeight = asyncHandler(async (req, res, next) => {
  const { weightKg, date } = req.body;
  const numericWeight = parseFloat(weightKg);
  if (isNaN(numericWeight) || numericWeight <= 0) {
    return res
      .status(400)
      .json({ message: "A valid, positive weight (in kg) is required." });
  }
  const weightLog = await loggingService.createWeightLog(
    req.user.id,
    numericWeight,
    date
  );
  res.status(201).json(weightLog);
});

export const getLogsForDate = asyncHandler(async (req, res, next) => {
  const { date } = req.params;
  const logs = await loggingService.getDailyLogs(req.user.id, date);
  res.status(200).json(logs);
});
