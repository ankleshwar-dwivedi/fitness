import asyncHandler from '../../../utils/asyncHandler.js';
import fitnessService from './fitness.service.js';

export const getMyFitnessPlan = asyncHandler(async (req, res, next) => {
  const plan = await fitnessService.getPlanByUserId(req.user.id);
  res.status(200).json(plan);
});

export const upsertMyFitnessPlan = asyncHandler(async (req, res, next) => {
  const planData = req.body;
  const userId = req.user.id;
  const plan = await fitnessService.createOrUpdatePlan(userId, planData);
  res.status(200).json(plan);
});