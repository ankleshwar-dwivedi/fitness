import express from 'express';
import { logMeal, logWorkout, logWater, getLogsForDate } from './logging.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/meals', protect, logMeal);
router.post('/workouts', protect, logWorkout);
router.post('/water', protect, logWater); // New endpoint
router.get('/date/:date', protect, getLogsForDate);

export default router;