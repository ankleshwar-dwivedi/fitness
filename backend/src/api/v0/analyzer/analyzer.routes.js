import express from 'express';
import { getNutritionAnalysis, getWorkoutAnalysis } from './analyzer.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

// @desc    Get historical nutrition analysis (macros, trends)
// @route   GET /api/v0/analyzer/nutrition?period=weekly
router.get('/nutrition', protect, getNutritionAnalysis);

// @desc    Get historical workout analysis (frequency, duration)
// @route   GET /api/v0/analyzer/workouts?period=monthly
router.get('/workouts', protect, getWorkoutAnalysis);

export default router;