import express from 'express';
import { getMealPlan, getWorkoutPlan } from './planners.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/meal', protect, getMealPlan);
router.get('/workout', protect, getWorkoutPlan);

export default router;