import asyncHandler from '../../../utils/asyncHandler.js';
import analyzerService from './analyzer.service.js';

export const getNutritionAnalysis = asyncHandler(async (req, res, next) => {
    const { period } = req.query; // 'weekly', 'monthly', 'all'
    const analysis = await analyzerService.analyzeNutrition(req.user.id, period);
    res.status(200).json(analysis);
});

export const getWorkoutAnalysis = asyncHandler(async (req, res, next) => {
    const { period } = req.query; // 'weekly', 'monthly', 'all'
    const analysis = await analyzerService.analyzeWorkouts(req.user.id, period);
    res.status(200).json(analysis);
});