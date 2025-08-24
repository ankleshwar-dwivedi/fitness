import express from 'express';
import { searchFoods, searchExercises } from './library.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/foods', protect, searchFoods);
router.get('/exercises', protect, searchExercises);

export default router;