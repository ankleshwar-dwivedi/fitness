import asyncHandler from '../../../utils/asyncHandler.js';
import plannerService from './planners.service.js';

export const getMealPlan = asyncHandler(async (req, res, next) => {
  const plan = await plannerService.generateUserMealPlan(req.user.id);
  res.status(200).json(plan);
});

export const getWorkoutPlan = asyncHandler(async (req, res, next) => {
  const plan = await plannerService.generateUserWorkoutPlan(req.user.id);
  res.status(200).json(plan);
});