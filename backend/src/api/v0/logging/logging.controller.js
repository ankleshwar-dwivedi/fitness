import asyncHandler from '../../../utils/asyncHandler.js';
import loggingService from './logging.service.js';

export const logMeal = asyncHandler(async (req, res, next) => {
  const { description, mealType, date } = req.body;
  const mealLog = await loggingService.createMealLog(req.user.id, description, mealType, date);
  res.status(201).json(mealLog);
});

export const logWorkout = asyncHandler(async (req, res, next) => {
  const { description, durationMin, date } = req.body;
  const workoutLog = await loggingService.createWorkoutLog(req.user.id, description, durationMin, date);
  res.status(201).json(workoutLog);
});



export const logWater = asyncHandler(async (req, res, next) => {
    const { amount, date } = req.body;
    const waterLog = await loggingService.createWaterLog(req.user.id, amount, date);
    res.status(201).json(waterLog);
});

export const getLogsForDate = asyncHandler(async (req, res, next) => {
  const { date } = req.params;
  const logs = await loggingService.getDailyLogs(req.user.id, date);
  res.status(200).json(logs);
});

