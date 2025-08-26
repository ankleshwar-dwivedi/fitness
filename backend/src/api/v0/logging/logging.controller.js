import asyncHandler from "../../../utils/asyncHandler.js";
import loggingService from "./logging.service.js";

export const logMeal = asyncHandler(async (req, res, next) => {
  // **THE FIX IS HERE: Add validation at the controller level.**
  const { items, mealType, date } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error(
      "Validation Error in logMeal: 'items' array is missing or empty.",
      req.body
    );
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
  // same as workout body, the service expects the full logData object.
  const date = req.body.date; // Extract date if it exists
  const workoutLog = await loggingService.createWorkoutLog(
    req.user.id,
    req.body,
    date
  );
  res.status(201).json(workoutLog);
});

export const logWater = asyncHandler(async (req, res, next) => {
    const { amount, date } = req.body;
    // **THE FIX IS HERE: Parse to number before validation**
    const numericAmount = parseInt(amount, 10);

    if (isNaN(numericAmount) || numericAmount <= 0) {
        console.error("Validation Error in logWater: 'amount' is invalid.", req.body);
        return res.status(400).json({ message: "A valid, positive water amount (in ml) is required." });
    }
    const waterLog = await loggingService.createWaterLog(req.user.id, numericAmount, date);
    res.status(201).json(waterLog);
});

export const getLogsForDate = asyncHandler(async (req, res, next) => {
  const { date } = req.params;
  const logs = await loggingService.getDailyLogs(req.user.id, date);
  res.status(200).json(logs);
});
